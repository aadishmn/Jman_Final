// LoginForm.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import "../styles/LoginForm.css"

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Access the navigate function

  const handleForgotPassword = () => {
    navigate('/resetPassword'); // Navigate to the reset password page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
    console.log(response)

      const { token, isAdmin, id, hasChanged } = response.data;

      localStorage.setItem('token', token); 
      localStorage.setItem('id', id); 

      handleLogin({ token, isAdmin });
      // Check if user has changed password
      if (hasChanged) {
        navigate('/home'); // Navigate to home page if password has been changed
      } else {
        navigate(`/changepassword/${id}`); // Navigate to change password page if password hasn't been changed
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <>
      <div className="background-image"></div>
      <div className="overlay"></div>
      <div className="loginFormContainer">
        <form className="loginForm" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={handleForgotPassword}>Forgot Password</button>
          <button type="submit">Login</button>
          <Link to="/signup">Sign Up</Link>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
