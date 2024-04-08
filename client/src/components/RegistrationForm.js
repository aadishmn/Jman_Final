import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import registrationImage from "../styles/Images/img2.svg"; // Import the image
import "../styles/RegistrationForm.css";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Access the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });
      const { token, isAdmin, id, hasChanged, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("role", role);

      // You might want to handle this differently depending on your app's logic
      navigate("/home"); // Navigate to home page after registration
    } catch (error) {
      setError("Registration failed");
    }
  };

  return (
    <div className="registrationContainer mt-5">
      <div className="row justify-content-center">
        <div className="registrationFormCol">
          <div className="card">
            <div className="card-body registrationCardBody">
              <div className="col-md-6">
                <img
                  src={registrationImage}
                  alt="Registration"
                  className="registrationImage img-fluid"
                />
              </div>
              <div className="col-md-6">
                <h3 className="card-title text-center mb-4">Register</h3>
                {error && <div className="alert alert-danger">{error}</div>}
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
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" id="registerBtn" className="btn w-100">
                    Register
                  </button>
                </form>
                <div className="text-center mt-3">
                  <Link to="/login">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
