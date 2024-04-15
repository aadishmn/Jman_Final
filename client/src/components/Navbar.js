import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaBars } from "react-icons/fa";

import logo from "../styles/Images/logo.png";

const Navbar = ({ isAuthenticated, isAdmin, handleLogout }) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const handleToggleClick = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setIsToggleOpen(false); // Close the toggle after logout
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
          onClick={handleToggleClick}
        >
          <FaBars />
        </button>
        <div
          className={`collapse navbar-collapse ${isToggleOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleToggleClick}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/timesheet"
                className="nav-link"
                onClick={handleToggleClick}
              >
                Timesheet
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/feedback"
                className="nav-link"
                onClick={handleToggleClick}
              >
                Feedback
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  to="/feedbackHistory"
                  className="nav-link"
                  onClick={handleToggleClick}
                >
                  Feedback History
                </Link>
              </li>
            )}
            {isAdmin && (
              <React.Fragment>
                <li className="nav-item">
                  <Link
                    to="/create_project"
                    className="nav-link"
                    onClick={handleToggleClick}
                  >
                    Create Project
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/allocate_project"
                    className="nav-link"
                    onClick={handleToggleClick}
                  >
                    Allocate Project
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="nav-link"
                    onClick={handleToggleClick}
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/bi"
                    className="nav-link"
                    onClick={handleToggleClick}
                  >
                    Bi
                  </Link>
                </li>
              </React.Fragment>
            )}
            <li className="nav-item">
              {isAuthenticated ? (
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={handleLogoutClick}
                >
                  Logout
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={handleToggleClick}
                >
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
