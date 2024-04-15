import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import butterfly from "../styles/Images/butterfly.png";

const Home = ({ isAdmin }) => {
  const navigate = useNavigate();

  const [assignedProjectsCount, setAssignedProjectsCount] = useState(0);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [hasEnteredTimesheet, setHasEnteredTimesheet] = useState(false);
  const [hasEnteredFeedback, setHasEnteredFeedback] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeProjects, setActiveProjects] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!token) return;

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

    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/totalUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTotalUsers(data.totalUsers);
        } else {
          console.error("Failed to fetch total number of users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching total number of users:", error);
      }
    };

    const fetchActiveProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/activeProjects"
        );
        const data = await response.json();
        setActiveProjects(data);
      } catch (error) {
        console.error("Error fetching active projects:", error);
      }
    };
    const fetchUsersData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsersData(data);
        } else {
          console.error("Failed to fetch users data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchAssignedProjectsCount();
    fetchAssignedProjects();
    fetchFlagData();
    fetchTotalUsers();
    fetchActiveProjects();
    fetchUsersData();
  }, []);

  const handleUserSelect = (event) => {
    setSelectedUserId(event.target.value);
  };

  return (
    <div
      className={`home-container ${isLoggedIn ? "logged-in" : "logged-out"}`}
    >
      {isLoggedIn ? (
        <>
          {isAdmin ? (
            <AdminHome
              totalUsers={totalUsers}
              activeProjects={activeProjects}
              hasEnteredTimesheet={hasEnteredTimesheet}
              hasEnteredFeedback={hasEnteredFeedback}
              handleUserSelect={handleUserSelect}
              usersData={usersData}
            />
          ) : (
            <UserHome
              assignedProjectsCount={assignedProjectsCount}
              assignedProjects={assignedProjects}
              hasEnteredTimesheet={hasEnteredTimesheet}
              hasEnteredFeedback={hasEnteredFeedback}
            />
          )}
        </>
      ) : (
        <div>
          <h1 className="home-title">Welcome to the TimFeeder!!!</h1>
          <p className="home-content">You need to login to proceed !!!</p>
        </div>
      )}
    </div>
  );
};

const AdminHome = ({
  totalUsers,
  activeProjects,
  hasEnteredTimesheet,
  hasEnteredFeedback,
  handleUserSelect,
  usersData,
}) => {
  const [selectedUserData, setSelectedUserData] = useState(null);

  const handleUserSelectChange = (event) => {
    const selectedUserId = event.target.value;

    const selectedUser = usersData.find(
      (user) => user.email === selectedUserId
    );
    setSelectedUserData(selectedUser);
  };

  return (
    <div className="adminBody">
      <h1 className="adminContent">Welcome Admin!</h1>
      <Card>
        <Card.Body>
          <Card.Title>Total Users</Card.Title>
          <Card.Text>{totalUsers}</Card.Text>
        </Card.Body>
      </Card>
      <h2 className="adminContent">Active Projects</h2>
      <div className="project-list">
        {activeProjects.map((project) => (
          <Card key={project._id} className="project-card">
            <Card.Body>
              <Card.Title>{project.name}</Card.Title>
              <Card.Text>Client: {project.client_name}</Card.Text>
              <Card.Text>Start Date: {project.start_date}</Card.Text>
              <Card.Text>End Date: {project.end_date}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="adminBody">
        <h2 className="adminContent">Select User</h2>
        <select onChange={handleUserSelectChange}>
          <option value="">Select User</option>
          {usersData.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>
      <div className="adminGetUser">
        {selectedUserData && (
          <div>
            <h2>User Details</h2>
            <p>Email: {selectedUserData.email}</p>
            <p>
              Name: {selectedUserData.firstName} {selectedUserData.lastName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserHome = ({
  assignedProjectsCount,
  assignedProjects,
  hasEnteredTimesheet,
  hasEnteredFeedback,
}) => {
  return (
    <div className="userBody">
      <h1 className="userContent">Welcome User!</h1>
      <Card className="assignedProjectsText">
        <Card.Body>
          <Card.Title>Number of projects assigned to you</Card.Title>
          <Card.Text>{assignedProjectsCount}</Card.Text>
        </Card.Body>
      </Card>
      <div className="project-list">
        {assignedProjects.map((project, index) => (
          <Card key={index} className="project-card">
            <Card.Body>
              <Card.Title>{project.name.toUpperCase()}</Card.Title>
              <Card.Text>
                {new Date(project.start_date).toLocaleDateString()} -{" "}
                {new Date(project.end_date).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Card className="status">
  <Card.Body>
    {hasEnteredTimesheet ? (
      <FaCheckCircle className="timesheet-icon" />
    ) : (
      <FaTimesCircle className="timesheet-icon" />
    )}
    <Card.Text>Timesheet Status</Card.Text>
  </Card.Body>
</Card>

<Card className="status">
  <Card.Body>
    {hasEnteredFeedback ? (
      <FaCheckCircle className="feedback-icon" />
    ) : (
      <FaTimesCircle className="feedback-icon" />
    )}
    <Card.Text>Feedback Status</Card.Text>
  </Card.Body>
</Card>

    </div>
  );
};

export default Home;
