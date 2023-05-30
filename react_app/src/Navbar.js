import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/bookform" activeClassName="active">
            Add Book
          </NavLink>
        </li>
        <li>
          <NavLink to="/booktable" activeClassName="active">
            View Books
          </NavLink>
        </li>
        <li>
          <NavLink to="/booksearch" activeClassName="active">
            Search Books
          </NavLink>
        </li>
        <li>
          <NavLink to="/signup" activeClassName="active">
            Sign Up
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" activeClassName="active">
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;
