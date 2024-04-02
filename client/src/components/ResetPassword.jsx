import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/forgotPassword",
        { email }
      );
      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setError("Failed to send password reset email");
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Forgot Password</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" id="resetbtn"  className="btn btn-primary">Submit</button>
      </form>
      <Link to="/login" id="resetbtn" className="back-to-login-link">Back to Login</Link>
    </div>
  );
};

export default ResetPassword;
