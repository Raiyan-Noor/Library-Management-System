import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import BookForm from "./Bookform";
import BookTable from "./Books";
import UpdateBook from "./UpdateBook";
import BookSearch from "./Booksearch";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import { useEffect } from "react";
export default function App() {
  const [token, setToken] = useState(null);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/bookform" element={<BookForm />} />
        <Route path="/booktable" element={<BookTable />} />
        <Route exact path="/update/:bookId" element={<UpdateBook />} />
        <Route exact path="/booksearch" element={<BookSearch />} />
        <Route path="/login" element={<Login setToken={setToken} />} />

        <Route exact path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
