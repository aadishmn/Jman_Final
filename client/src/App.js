// App.js

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import RegistrationForm from "./components/RegistrationForm";
import ConfirmPass from "./pages/ConfirmPass";
import ResetPassword from "./components/ResetPassword"
import AddProject from "./pages/addProject";
import AllocateProject from "./pages/allocateProject";
import TimeSheetParent from "./pages/Timesheet";
import Feedback from "./pages/Feedback";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const[flag,setFlag]=useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userData) => {
    const { token, isAdmin } = userData;
    if(token || flag==false){
      if(localStorage.getItem('token')){
      setIsAuthenticated(true);
      }

    }
    else{
      setIsAuthenticated(false);

    }
    setIsAdmin(isAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        handleLogout={handleLogout} // Pass the handleLogout function to the Navbar component
      />
      <Routes>
        <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
        {isAdmin ? (
          <Route path="/signup" element={<RegistrationForm />} />
        ) : (
          <Route path="/signup" element={<Navigate to="/home" />} />
        )}
        {isAdmin && <Route path="/home" element={<Home isAdmin={isAdmin} />} />}
        <Route path="/confirmpass/:id" element={<ConfirmPass />} />

        <Route path="/resetPassword" element={<ResetPassword />}/>
        <Route path="/create_project" element={<AddProject />}/>
        <Route path="/allocate_project" element={<AllocateProject />}/>
        <Route path="/timesheet" element={<TimeSheetParent />}/>
        <Route path="/feedback" element={ <Feedback />}/>

      </Routes>
    </Router>
  );
};

export default App;
