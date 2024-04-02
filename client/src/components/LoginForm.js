import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import "../styles/LoginForm.css"

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Access the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-purple">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="inputEmail" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="inputEmail" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="inputPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" id="logbtn"className=" btn w-100">Login</button>
              </form>
              <div className="text-center mt-3">
                <Link to="/signup">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
