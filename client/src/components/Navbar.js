// Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../styles/Images/logo.png";

const Navbar = ({ isAuthenticated, isAdmin, handleLogout }) => {
  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function passed from the parent component
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-purple">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="logo" className="navbar-logo" />
          TimFeed
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/timesheet" className="nav-link">
                Timesheet
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/feedback" className="nav-link">
                Feedback
              </Link>
            </li>
            {isAdmin && (
              <React.Fragment>
                <li className="nav-item">
                  <Link to="/create_project" className="nav-link">
                    Create Project
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/allocate_project" className="nav-link">
                    Allocate Project
                  </Link>
                </li>{" "}
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">
                    Register
                  </Link>
                </li>
              </React.Fragment>
            )}
            <li className="nav-item">
              {isAuthenticated ? (
                <Link to="/" className="nav-link" onClick={handleLogoutClick}>
                  Logout
                </Link>
              ) : (
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
