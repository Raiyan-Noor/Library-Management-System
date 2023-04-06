
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('name');
  const [books, setBooks] = useState([]);

  const handleSearch = () => {
    axios.get(`http://localhost:8080/books/search?searchTerm=${searchTerm}&filterOption=${filterOption}`)
      .then(res => {
        setBooks(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      <select value={filterOption} onChange={e => setFilterOption(e.target.value)}>
        <option value="name">Name</option>
        <option value="author">Author</option>
        <option value="genre">Genre</option>
        <option value="description">Description</option>
      </select>
      <button onClick={handleSearch}>Search</button>
      <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Author</th>
          <th>Genre</th>
        </tr>
      </thead>
      <tbody>
        {books.map(book => (
          <tr key={book.id}>
            <td>{book.id}</td>
            <td>{book.name}</td>
            <td>{book.author}</td>
            <td>{book.genre}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}


export default BookSearch;
