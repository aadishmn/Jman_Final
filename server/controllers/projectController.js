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
    const startDate = new Date(start);
    const endDate = new Date(end);

    const newProj = new Project({
      PID: randomString,
      name: name,
      start_date: start,
      end_date: end,
      client_name: client_name,
      created_at: new Date(),
    });

    const result = await newProj.save();
    res.json({ message: "Project Added" });
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
  } catch (err) {
    console.error("Error creating project", err);
    res.status(500).json({ message: "Error creating project" });
  }
};

const activeProjects = async (req, res) => {
  try {
    const activeProjects = await Project.find();

    res.json(activeProjects);
  } catch (err) {
    console.error("Error fetching active projects", err);
    res.status(500).json({ message: "Error fetching active projects" });
  }
};

const users = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const totalUsers = async (req, res) => {
  try {
    const totalUsers = User.length;
    res.json({ totalUsers });
  } catch (err) {
    console.error("Error fetching all projects", err);
    res.status(500).json({ message: "Error fetching all projects" });
  }
};

const getUsersProjectsAllocation = async (req, res) => {
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
        start: project.start_date,
        end: project.end_date,
      })),
    };
    res.json(formattedData);
  } catch (err) {
    console.error("Error creating project", err);
    res.status(500).json({ message: "Error creating project" });
  }
};

const getUsersProjects = async (req, res) => {
  try {
    const userEmail = req.data.email;

    const userProjects = await ProjectAllocate.find({ email: userEmail });

    // Define an array to store project details
    const projectsDetails = [];

    for (const project of userProjects) {
      const projectDetail = await Project.findOne({ PID: project.PID });
      projectsDetails.push({
        PID: project.PID,
        name: projectDetail.name,
        start_date: project.allocation_start,
        end_date: project.allocation_end,
      });
    }

    const formattedData = {
      message: "User's projects received!",
      projects: projectsDetails,
    };
    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching user's projects", err);
    res.status(500).json({ message: "Error fetching user's projects" });
  }
};

const countProjects = async (req, res) => {
  try {
    const userEmail = req.data.email;
    const assignedProjectsCount = await ProjectAllocate.countDocuments({
      email: userEmail,
    });
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
  totalUsers,
  activeProjects,
  users,
  getUsersProjectsAllocation,
};
