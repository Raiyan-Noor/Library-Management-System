const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); // Add this line
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors()); // Add this line

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bookstore",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
  // Create bookstore database
  connection.query("CREATE DATABASE IF NOT EXISTS bookstore", (err, result) => {
    if (err) throw err;
    console.log("bookstore database created");
  });

  // Create books table
  connection.query("USE bookstore", (err) => {
    if (err) throw err;
    connection.query(
      `CREATE TABLE IF NOT EXISTS books (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    )`,
      (err, result) => {
        if (err) throw err;
        console.log("books table created");
      }
    );
  });
  // Create users table
  connection.query("USE bookstore", (err) => {
    if (err) throw err;
    connection.query(
      `CREATE TABLE IF NOT EXISTS users (
          id INT(11) NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
          PRIMARY KEY (id)
      )`,
      (err, result) => {
        if (err) throw err;
        console.log("users table created");
      }
    );
  });
});

// Register a new user
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists in database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    email,
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        // Insert new user into database
        const newUser = { name, email, password: hashedPassword };
        connection.query("INSERT INTO users SET ?", newUser, (err, result) => {
          if (err) throw err;
          res.status(201).json({ message: "User created successfully" });
        });
      });
    }
  );
});

// Login a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if email exists in database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    email,
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(400).json({ error: "Email not found" });
      }

      // Check if password matches
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return res.status(400).json({ error: "Incorrect password" });
        }

        // Create and sign a JWT token
        const token = jwt.sign(
          {
            userId: user.id,
            role: user.role,
            iat: Math.floor(Date.now() / 1000) - 30,
          },
          "secretkey"
        );
        res.json({ token });
      });
    }
  );
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  console.log();
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "secretkey", (err, payload) => {
    console.log(err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    req.user = { id: payload.userId, role: payload.role };
    next();
  });
};

// Borrow a book
app.post("/borrow", authMiddleware, (req, res) => {
  console.log(req.user);

  if (req.user.role !== "user") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const bookId = req.body.bookId;
  if (!bookId) {
    return res.status(400).json({ error: "Missing bookId parameter" });
  }

  // Check if book exists
  connection.query(
    "SELECT * FROM books WHERE id = ?",
    bookId,
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(404).json({ error: "Book not found" });
      }

      const book = results[0];
      // Check if book is already borrowed
      connection.query(
        "SELECT * FROM borrows WHERE book_id = ? AND return_date IS NULL",
        bookId,
        (err, results) => {
          if (err) throw err;
          if (results.length > 0) {
            return res.status(400).json({ error: "Book is already borrowed" });
          }

          // Borrow the book
          const borrowDate = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          const borrow = {
            user_id: req.user.id,
            book_id: bookId,
            borrow_date: borrowDate,
          };
          connection.query(
            "INSERT INTO borrows SET ?",
            borrow,
            (err, result) => {
              if (err) throw err;
              res.json({ message: "Book borrowed successfully" });
            }
          );
        }
      );
    }
  );
});

// Return a book
app.post("/return", authMiddleware, (req, res) => {
  // Check if user is authorized to return books
  if (req.user.role !== "user") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const bookId = req.body.bookId;
  if (!bookId) {
    return res.status(400).json({ error: "Missing bookId parameter" });
  }

  // Check if book is borrowed by the user
  connection.query(
    "SELECT * FROM borrows WHERE user_id = ? AND book_id = ? AND return_date IS NULL",
    [req.user.id, bookId],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(404).json({ error: "Book not found" });
      }

      const borrow = results[0];
      const returnDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      // Update borrow record with return date
      connection.query(
        "UPDATE borrows SET return_date = ? WHERE id = ?",
        [returnDate, borrow.id],
        (err, result) => {
          if (err) throw err;
          res.json({ message: "Book returned successfully" });
        }
      );
    }
  );
});

// End of code.
// GET books by search query
app.get("/books/search", (req, res) => {
  const searchTerm = req.query.searchTerm;
  const filterOption = req.query.filterOption;
  console.log("Hello");

  // Use connection pool to execute MySQL query
  connection.query(
    `SELECT * FROM books WHERE ${filterOption} LIKE ?`,
    [`%${searchTerm}%`],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json(results);
    }
  );
});

// GET all books
app.get("/books", (req, res) => {
  connection.query("SELECT * FROM books", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET book by ID
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM books WHERE id = ?", id, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// POST a new book
app.post("/books", (req, res) => {
  const { name, author, genre } = req.body;
  const newBook = { name, author, genre };
  connection.query("INSERT INTO books SET ?", newBook, (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId });
  });
});

// PUT update a book by ID
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { name, author, genre } = req.body;
  const updatedBook = { name, author, genre };
  connection.query(
    "UPDATE books SET ? WHERE id = ?",
    [updatedBook, id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Book updated successfully" });
    }
  );
});

// DELETE a book by ID
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM books WHERE id = ?", id, (err, result) => {
    if (err) throw err;
    res.json({ message: "Book deleted successfully" });
  });
});

// Get stats
app.get("/stats", (req, res) => {
  const stats = {};

  // Count number of books
  connection.query("SELECT COUNT(*) AS count FROM books", (err, results) => {
    if (err) throw err;
    stats.numBooks = results[0].count;

    // Count number of books for each genre
    connection.query(
      "SELECT genre, COUNT(*) AS count FROM books GROUP BY genre",
      (err, results) => {
        if (err) throw err;
        stats.genres = results;

        // Count number of authors
        connection.query(
          "SELECT COUNT(DISTINCT author) AS count FROM books",
          (err, results) => {
            if (err) throw err;
            stats.numAuthors = results[0].count;
          }
        );
      }
    );
  });
});

// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
