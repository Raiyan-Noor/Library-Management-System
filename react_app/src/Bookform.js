import React, { useState } from 'react';
import axios from 'axios';


function BookForm() {
  const [book, setBook] = useState({
    name: '',
    author: '',
    genre: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBook({
      ...book,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateInputs(book);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    axios.post('http://localhost:8080/books', book)
      .then((response) => {
        console.log(response.data);
        setBook({
          name: '',
          author: '',
          genre: ''
        });
        setErrors({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validateInputs = (book) => {
    const errors = {};
    if (!book.name.match(/^[a-zA-Z ]+$/)) {
      errors.name = 'Name should only contain letters';
    }
    if (!book.author.match(/^[a-zA-Z]+\s[a-zA-Z]+$/)) {
      errors.author = 'Author should be in the format: Firstname Lastname';
    }
    if (!book.genre) {
      errors.genre = 'Please select a genre';
    }
    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={book.name}
          onChange={handleChange}
          required
        />
        {errors.name && <span>{errors.name}</span>}
      </label>
      <br />
      <label>
        Author:
        <input
          type="text"
          name="author"
          value={book.author}
          onChange={handleChange}
          required
        />
        {errors.author && <span>{errors.author}</span>}
      </label>
      <br />
      <label>
        Genre:
        <select
          name="genre"
          value={book.genre}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a genre --</option>
          <option value="Fiction">Fiction</option>
          <option value="Novel">Novel</option>
          <option value="Non-fiction">Non-fiction</option>
        </select>
        {errors.genre && <span>{errors.genre}</span>}
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default BookForm;
