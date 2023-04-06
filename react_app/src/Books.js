import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookTable() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/books/${id}`)
      .then(response => {
        setBooks(books.filter(book => book.id !== id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map(book => (
          <tr key={book.id}>
            <td>{book.id}</td>
            <td>{book.name}</td>
            <td>{book.author}</td>
            <td>{book.genre}</td>
            <td>
              <a href={`http://localhost:3001/update/${book.id}`}>Update</a>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookTable;
