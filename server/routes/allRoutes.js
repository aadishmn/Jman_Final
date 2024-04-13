const { Router } = require("express");

const router = Router();

const authUtils = require("../utils/authUtils");
const AuthControllers = require("../controllers/authController");
const ProjectControllers = require("../controllers/projectController");
const TimesheetControllers = require("../controllers/timesheetController");
const Feedback = require("../controllers/feedbackController");
//main apis
router.post("/login", AuthControllers.login);
router.post("/register", AuthControllers.register);
router.put("/change_password/:id", AuthControllers.change_password);
router.post("/forgot_password", AuthControllers.forgot_password);
router.post("/create_project", ProjectControllers.create_project);
router.post("/allocate_project", ProjectControllers.allocate_project);
router.get(
  "/getUsersProjects",
  authUtils.authenticateJWT,
  ProjectControllers.getUsersProjects
);
router.get(
  "/getUsersProjectsAllocation",
  authUtils.authenticateJWT,
  ProjectControllers.getUsersProjectsAllocation
);
router.post(
  "/getTimesheetData",
  authUtils.authenticateJWT,
  TimesheetControllers.RertreiveTimesheetPerWeek
);
router.get(
  "/getUserProject",
  authUtils.authenticateJWT,
  TimesheetControllers.RetreiveUserProject
);
router.post(
  "/CreateUpdateTimesheets",
  authUtils.authenticateJWT,
  TimesheetControllers.CreateUpdateTimesheets
);
router.post(
  "/feedback/CreateFeedback",
  authUtils.authenticateJWT,
  Feedback.CreateFeedbackEntry
);
router.get(
  "/assignedProjectsCount",
  authUtils.authenticateJWT,
  ProjectControllers.countProjects
);

router.get(
  "/checkTimesheet",
  authUtils.authenticateJWT,
  TimesheetControllers.checkTimesheet
);
router.get(
  "/checkFeedback",
  authUtils.authenticateJWT,
  TimesheetControllers.checkFeedback
);

router.get("/totalUsers", ProjectControllers.totalUsers);
router.get("/activeProjects", ProjectControllers.activeProjects);
router.get("/users", ProjectControllers.users);

module.exports = router;
