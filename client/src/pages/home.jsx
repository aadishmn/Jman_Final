// Home.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ isAdmin }) => {
  const navigate = useNavigate(); // Access the navigate function

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Navigate back to the login page
    navigate('/login');
  };

  const handleNewUserRegistration = () => {
    // Navigate to the registration page
    navigate('/signup');
  };

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      {isAdmin && <button onClick={handleNewUserRegistration}>Register New User</button>}
    </div>
  );
};

export default Home;
