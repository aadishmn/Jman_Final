import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import RegistrationForm from "./pages/RegistrationForm";
import ConfirmPass from "./pages/ConfirmPass";
import ResetPassword from "./components/ResetPassword";
import AddProject from "./pages/addProject";
import AllocateProject from "./pages/allocateProject";
import TimeSheetParent from "./pages/Timesheet";
import Feedback from "./pages/Feedback";
import FeedbackHistory from "./pages/feedbackHistory";
import { Bi } from "./pages/Bi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userData) => {
    const { token, isAdmin } = userData;
    setIsAdmin(isAdmin);
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    sessionStorage.removeItem("start_period");
    sessionStorage.removeItem("end_period");
    sessionStorage.removeItem("projectId_timesheet");
    setIsAuthenticated(false);
    setIsAdmin(false);
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route
          path="/login"
          element={<LoginForm handleLogin={handleLogin} />}
        />
        <Route path="/signup" element={<SignupRedirect isAdmin={isAdmin} />} />
        <Route path="/" element={<Home isAdmin={isAdmin} />} />
        <Route path="/changepassword/:id" element={<ConfirmPass />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/create_project" element={<AddProject />} />
        <Route path="/allocate_project" element={<AllocateProject />} />
        <Route path="/timesheet" element={<TimeSheetParent />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/bi" element={<Bi />} />
        <Route path="/feedbackHistory" element={<FeedbackHistory />} />
      </Routes>
    </Router>
  );
};

const SignupRedirect = ({ isAdmin }) => {
  return isAdmin ? <RegistrationForm /> : <Navigate to="/home" />;
};

export default App;
