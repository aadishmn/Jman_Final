import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import "../styles/RegistrationForm.css"; // Import RegistrationForm.css
import axios from 'axios';

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { firstName, lastName, email, password });

      setError('');
      // Optionally, you can redirect the user to a different page after successful registration
    } catch (error) {
      setError('Registration failed');
    }
  };
  return (
    <>
      <div className="background-image"></div>
      <div className="overlay"></div>
      <div className="regFormContainer">
        <form className="regForm" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Register</button>
          <Link to="/login">Login</Link>
        </form>
      </div>
    </>
  );
};

export default RegistrationForm;
