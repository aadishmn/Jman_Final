// ConfirmPass.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "./ChangePassword.css";

const ConfirmPass = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/changepassword/${localStorage.getItem("id")}`,
        { password: newPassword }
      );
      if (response.status === 200) {
        alert("Password Updated Successfully !");
        navigate("/login");
      } else {
        console.log(response);
        setErrorMessage("Internal Server Error");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while updating password");
    }
  };

  return (
    <div>
      <div className="formCard">
        <form className="changePassForm">
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Re-enter New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <br />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button onClick={handleChangePassword}>Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmPass;
