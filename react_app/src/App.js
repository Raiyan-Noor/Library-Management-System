import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookForm from "./Bookform";
import BookTable from "./Books";
import UpdateBook from "./UpdateBook";
import BookSearch from "./Booksearch";

export default function App() {
  return (
    <BrowserRouter>
     
      <Routes> 
        <Route exact path="/bookform" element={<BookForm/>} />
        <Route path="/booktable" element={<BookTable />} />
        <Route exact path="/update/:bookId" element={<UpdateBook/>} />
        <Route exact path="/booksearch" element={<BookSearch/>}/>
      </Routes>  
 
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);