import { useState } from 'react';
import axios from 'axios';

function BookSearch() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');
  console.log(searchTerm);

  const handleSearch = () => {
    console.log("hello");
    axios.get(`http://localhost:3000/books?search=${searchTerm}&filter=${filterOption}`)
      .then(res => {
        setBooks(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
        <option value="">All</option>
        <option value="name">Name</option>
        <option value="author">Author</option>
        <option value="genre">Genre</option>
      </select>
      <button onClick={handleSearch}>Search</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
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
