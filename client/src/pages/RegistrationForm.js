import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import registrationImage from "../styles/Images/img2.svg"; // Import the image
import "../styles/RegistrationForm.css";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        firstName,
        lastName,
        email,
        role,
      });

      const { token, isAdmin, id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("id", id);

      navigate("/");
      setSuccess("Registration success");
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
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}
                <form className="regForm" onSubmit={handleSubmit}>
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
                    <label htmlFor="inputFirstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputFirstName"
                      placeholder="Enter First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputLastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputLasstName"
                      placeholder="Enter Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputRole" className="form-label">
                      Role
                    </label>
                    <select
                      className="form-select"
                      id="inputRole"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="consultant">Consultant</option>
                      <option value="software_developer">
                        Software Developer
                      </option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>

                  <button type="submit" id="registerBtn" className="btn w-100">
                    Register
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

export default RegistrationForm;
