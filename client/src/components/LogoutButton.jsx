// LogoutButton.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
