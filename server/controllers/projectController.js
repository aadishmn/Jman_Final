const Project = require("../models/Project");
const User = require("../models/User");
const ProjectAllocate = require("../models/ProjectAllocate");

const create_project = async (req, res) => {
  try {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    const { name, start, end, client_name } = req.body;

    // if (req.data && req.data.isAdmin === true) {
    const newProj = new Project({
      PID: randomString,
      name: name,
      start: start,
      end: end,
      client_name: client_name,
      created_at: new Date(),
    });

    try {
      const result = await newProj.save();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    res.json({ message: "Project Added" });

    // } else {
    //     res.status(403).json({ message: "Only admins can perform this function" });
    // }
  } catch (err) {
    console.error("Error creating project", err);
    res.status(500).json({ message: "Error creating project" });
  }
};

const allocate_project = async (req, res) => {
  try {
    const { PID, email, allocation_start, allocation_end } = req.body;
    // if (req.user && req.user.role === "admin") {
    const newProj = new ProjectAllocate({
      PID: PID,
      email: email,
      allocation_start: allocation_start,
      allocation_end: allocation_end,
      created_at: new Date(),
    });

    try {
      const result = await newProj.save();
    } catch (error) {
      console.error(error);
    }
    res.json({ message: "Project allocated" });

    // } else {
    //     res.status(403).json({ message: "Only admins can perform this function" });
    // }
  } catch (err) {
    console.error("Error creating project", err);
    res.status(500).json({ message: "Error creating project" });
  }
};

const getUsersProjects = async (req, res) => {
  try {
    // if (req.user && req.user.role === "admin") {
    const Users = await User.find();
    const Projects = await Project.find();
    const formattedData = {
      message: "data received!",
      users: Users.map((user) => ({ email: user.email, name: user.firstName })),
      projects: Projects.map((project) => ({
        PID: project.PID,
        name: project.name,
        start: project.start,
        end: project.end,
      })),
    };
    res.json(formattedData);

    // } else {
    //     res.status(403).json({ message: "Only admins can perform this function" });
    // }
  } catch (err) {
    console.error("Error creating project", err);
    res.status(500).json({ message: "Error creating project" });
  }
};

const countProjects = async (req, res) => {
  try {
    // Retrieve the email of the logged-in user from the request
    const userEmail = req.data.email; // Adjust this according to your authentication middleware
    // Query the database to count the number of projects allocated to the user
    const assignedProjectsCount = await ProjectAllocate.countDocuments({
      email: userEmail,
    });
    // Send the count as a response
    res.json({ assignedProjects: assignedProjectsCount });
  } catch (error) {
    console.error("Error fetching assigned projects:", error);
    res.status(500).json({ message: "Error fetching assigned projects" });
  }
};

module.exports = {
  create_project,
  allocate_project,
  getUsersProjects,
  countProjects,
};
