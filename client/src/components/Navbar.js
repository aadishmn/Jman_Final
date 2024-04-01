// Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ isAuthenticated, isAdmin, handleLogout }) => {
  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function passed from the parent component
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        My App
      </Link>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">
            About
          </Link>
        </li>
        {isAuthenticated && isAdmin && (
          <li className="nav-item">
            <Link to="/signup" className="nav-link">
              Register
            </Link>
          </li>
        )}
        <li className="nav-item">
          {isAuthenticated ? (
            <button onClick={handleLogoutClick} className="nav-link">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
