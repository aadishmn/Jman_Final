import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import butterfly from "../styles/Images/butterfly.png"
const Home = ({ isAdmin }) => {
  const navigate = useNavigate(); // Access the navigate function

  const [assignedProjectsCount, setAssignedProjectsCount] = useState(0);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [hasEnteredTimesheet, setHasEnteredTimesheet] = useState(false);
  const [hasEnteredFeedback, setHasEnteredFeedback] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Check if token exists

    if (!token) return; // If no token, return and don't fetch data

    // Fetch the number of assigned projects for the logged-in user
    const fetchAssignedProjectsCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/assignedProjectsCount",
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
              Authorization: `Bearer ${token}`,
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
        const timesheetResponse = await fetch(
          "http://localhost:5000/api/checkTimesheet",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const feedbackResponse = await fetch(
          "http://localhost:5000/api/checkFeedback",
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  return (
    <div className={`home-container ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
      {isLoggedIn ? (
        <>
          <h1 className="home-title">Welcome to the TimFeeder!</h1>

          {/* Admin buttons */}
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

          {/* Assigned Projects */}
          <div className="home-cards-container mt-5">
            {/* Assigned Projects Card */}
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
                          {new Date(project.start_date).toLocaleDateString()} -{" "}
                          {new Date(project.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Feedback and Timesheet Card */}
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
              
                </div>
              </div>
            </div>
            {/* Add more cards as needed */}
            <img className="homeImg" src={butterfly} alt="Illustration" />

          </div>
        </>
      ) : (
        <div>
          <h1 className="home-title">Welcome to the TimFeeder!</h1>
          <img className="homeImg" src={butterfly} alt="Illustration" />
          <p className="home-content">You need to login to proceed !!!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
