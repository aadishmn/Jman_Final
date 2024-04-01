import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default ResetPassword;
