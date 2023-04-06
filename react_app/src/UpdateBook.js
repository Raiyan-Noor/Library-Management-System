import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

const UpdateBook = () => {
    const { bookId } = useParams();
    console.log(bookId);
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/books/${bookId}`)
      .then(response => {
        setName(response.data.name);
        setAuthor(response.data.author);
        setGenre(response.data.genre);
      })
      .catch(error => {
        console.log(error);
      });
  }, [bookId]);

  const handleUpdate = (event) => {
    event.preventDefault();
    const updatedBook = { name, author, genre };
    axios.put(`http://localhost:3000/books/${bookId}`, updatedBook)
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <h2>Update Book</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input type="text" id="author" value={author} onChange={(event) => setAuthor(event.target.value)} />
        </div>
        <div>
          <label htmlFor="genre">Genre:</label>
          <select id="genre" value={genre} onChange={(event) => setGenre(event.target.value)}>
            <option value="">Select a genre</option>
            <option value="Fiction">Fiction</option>
            <option value="Novel">Novel</option>
            <option value="Non-fiction">Non-fiction</option>
          </select>
        </div>
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default UpdateBook;
