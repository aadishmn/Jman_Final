import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProject.css"; // Import AddProject.css

function AddProject() {
  const [formData, setFormData] = useState({
    name: "",
    client_name: "",
    start: "",
    end: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/create_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const res = await response.json();
      if (res.message !== "Project Added") {
        alert("Failed to add project");
      } else {
        alert("Project added successfully");
      }

      setFormData({
        name: "",
        client_name: "",
        start: "",
        end: "",
      });
    } catch (error) {
      console.error("Error adding project:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="project-title" style={{ color: "white" }}>
        Add Project
      </h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="project-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Project Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="client_name" className="form-label">
            Client Name:
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="start" className="form-label">
            Start Date:
          </label>
          <input
            type="date"
            id="start"
            name="start"
            value={formData.start}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end" className="form-label">
            End Date:
          </label>
          <input
            type="date"
            id="end"
            name="end"
            value={formData.end}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" id="subbtn" className="btn btn-primary btn-sm">
          Add Project
        </button>
      </form>
    </div>
  );
}

export default AddProject;
