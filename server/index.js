const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Add this line


const app = express();
app.use(express.json());
app.use(cors()); // Add this line

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bookstore'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  // Create bookstore database
  connection.query('CREATE DATABASE IF NOT EXISTS bookstore', (err, result) => {
    if (err) throw err;
    console.log('bookstore database created');
  });

  // Create books table
  connection.query('USE bookstore', (err) => {
    if (err) throw err;
    connection.query(`CREATE TABLE IF NOT EXISTS books (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    )`, (err, result) => {
      if (err) throw err;
      console.log('books table created');
    });
  });
});

// GET all books
app.get('/books', (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET book by ID
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM books WHERE id = ?', id, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// POST a new book
app.post('/books', (req, res) => {
  const { name, author, genre } = req.body;
  const newBook = { name, author, genre };
  connection.query('INSERT INTO books SET ?', newBook, (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId });
  });
});

// PUT update a book by ID
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { name, author, genre } = req.body;
  const updatedBook = { name, author, genre };
  connection.query('UPDATE books SET ? WHERE id = ?', [updatedBook, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Book updated successfully' });
  });
});

// DELETE a book by ID
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM books WHERE id = ?', id, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Book deleted successfully' });
  });
});

// GET books by search query
app.get('/books/search', (req, res) => {
  const { query } = req.query;
  
  console.log("hello");
  console.log(query);
  connection.query('SELECT * FROM books WHERE name LIKE ? OR author LIKE ? OR genre LIKE ?', [`%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
    if (err) throw err;
    
    res.json(results);
  });
});


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
