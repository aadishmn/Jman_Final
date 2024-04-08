import React, { useState, useEffect } from "react";
import "../styles/Allocate_Project.css";
const AllocateProject = () => {
  const [data, setData] = useState({ users: [], projects: [] });
  const [formData, setFormData] = useState({
    PID: "",
    email: "",
    allocation_start: "",
    allocation_end: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getUsersProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getUsersProjects",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const responseData = await response.json();
        if (response.ok) {
          setData(responseData);
        } else {
          throw new Error(responseData.message || "Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        setErrorMessage(error.message);
      }
    };

    getUsersProjects();
  }, []);

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
      const response = await fetch(
        "http://localhost:5000/api/allocate_project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...formData,
          }),
        }
      );

      const res = await response.json();
      if (res.message !== "Project allocated") {
        alert("Failed to allocate project");
      } else {
        alert("Project allocated successfully");
      }

      setFormData({
        PID: "",
        email: "",
        allocation_start: "",
        allocation_end: "",
      });
    } catch (error) {
      console.error("Error allocating project:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 style={{ color: "white" }}>Allocate Projects</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="projectID" className="form-label">
            Project ID:
          </label>
          <select
            id="PID"
            name="PID"
            value={formData.PID}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Project ID</option>
            {data.projects.map((project) => (
              <option key={project.PID} value={project.PID}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Name:
          </label>
          <select
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Email</option>
            {data.users.map((user) => (
              <option key={user.email} value={user.email}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="allocationStart" className="form-label">
            Allocation Start:
          </label>
          <input
            type="date"
            id="allocation_start"
            name="allocation_start"
            value={formData.allocation_start}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="allocationEnd" className="form-label">
            Allocation End:
          </label>
          <input
            type="date"
            id="allocation_end"
            name="allocation_end"
            value={formData.allocation_end}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" id="allocatebtn" className="btn btn-primary">
          Allocate Project
        </button>
      </form>
    </div>
  );
};

export default AllocateProject;
