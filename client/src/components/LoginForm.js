import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../styles/Images/login.svg"; // Import the image
import "../styles/LoginForm.css";

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Access the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      const { token, isAdmin, id, hasChanged, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("role", role);

      handleLogin({ token, isAdmin });
      // Check if user has changed password
      if (hasChanged) {
        navigate("/"); // Navigate to home page if password has been changed
      } else {
        navigate(`/changepassword/${id}`); // Navigate to change password page if password hasn't been changed
      }
    } catch (error) {
      setError("Login failed");
    }
  };

  return (
    <div className="loginContainer mt-5">
      <div className="loginSubContainer row justify-content-center">
        <div className="loginFormCol">
          <div className="card loginCard  ">
            <div className="card-body loginCardBody">
              <div className="col-md-6">
                <img
                  src={loginImage}
                  alt="Registration"
                  className="loginImage img-fluid"
                />
              </div>
              <div className="col-md-6">
                <h3 className="card-title text-center mb-4">Login</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                {/* Add the image near the form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="inputEmail"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="inputPassword"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" id="logbtn" className="btn w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
