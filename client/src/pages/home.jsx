import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = ({ isAdmin }) => {
  const navigate = useNavigate(); // Access the navigate function

  const [assignedProjectsCount, setAssignedProjectsCount] = useState(0);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [hasEnteredTimesheet, setHasEnteredTimesheet] = useState(false);
  const [hasEnteredFeedback, setHasEnteredFeedback] = useState(false);

  useEffect(() => {
    // Fetch the number of assigned projects for the logged-in user
    const fetchAssignedProjectsCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/assignedProjectsCount",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAssignedProjectsCount(data.assignedProjects);
        } else {
          console.error(
            "Failed to fetch assigned projects count:",
            data.message
          );
        }
      } catch (error) {
        console.error("Error fetching assigned projects count:", error);
      }
    };

    const fetchAssignedProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getUsersProjects",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAssignedProjects(data.projects);
        } else {
          console.error("Failed to fetch assigned projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching assigned projects:", error);
      }
    };

    const fetchFlagData = async () => {
      try {
        // Replace with actual API endpoints to check if the user has entered timesheet or feedback
        const timesheetResponse = await fetch(
          "http://localhost:5000/api/checkTimesheet",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const feedbackResponse = await fetch(
          "http://localhost:5000/api/checkFeedback",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const timesheetData = await timesheetResponse.json();
        const feedbackData = await feedbackResponse.json();

        setHasEnteredTimesheet(timesheetData.hasEnteredTimesheet);
        setHasEnteredFeedback(feedbackData.hasEnteredFeedback);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAssignedProjectsCount();
    fetchAssignedProjects();
    fetchFlagData();
  }, []);

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    // Navigate back to the login page
    navigate("/login");
  };

  const handleNewUserRegistration = () => {
    // Navigate to the registration page
    navigate("/signup");
  };

  return (
    <div className="home-container mt-5">
      <h1 className="home-title">Welcome to the TimFeeder!</h1>

      {/* {isAdmin && (
        <div className="admin-buttons">
          <Link to="/create_project" className="btn btn-primary mt-3 mr-2">
            Create Project
          </Link>
          <Link to="/allocate_project" className="btn btn-primary mt-3">
            Allocate Project
          </Link>
        </div>
      )} */}

      <div className="home-cards-container mt-5">
        <div className="home-card project-card">
          <div className="card">
            <div className="card-body">
              <h5 className="card-heading">Assigned Projects</h5>
              <p className="card-text">
                Number of projects assigned to you: {assignedProjectsCount}
              </p>
              <div className="project-list">
                {assignedProjects.map((project, index) => (
                  <div key={index}>
                    <h3>{project.name}</h3>
                    <p>
                      {new Date(project.start).toLocaleDateString()} -{" "}
                      {new Date(project.end).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="home-card feedback-card">
          <div className="card">
            <div className="card-body">
              <h5 className="card-heading">Feedback and Timesheet</h5>
              <p className="card-text">
                {hasEnteredTimesheet ? (
                  <span>Timesheet Entered</span>
                ) : (
                  <span>No Timesheet Entered</span>
                )}
              </p>
              <p className="card-text">
                {hasEnteredFeedback ? (
                  <span>Feedback Entered</span>
                ) : (
                  <span>No Feedback Entered</span>
                )}
              </p>
              <Link to="#" className="btn btn-primary">
                Go somewhere
              </Link>
            </div>
          </div>
        </div>
        {/* Add more cards as needed */}
      </div>
    </div>
  );
};

export default Home;
