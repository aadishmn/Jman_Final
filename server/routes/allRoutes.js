const { Router } = require('express'); 

const router = Router();

const authUtils=require('../utils/authUtils')
const AuthControllers = require('../controllers/authController');
const ProjectControllers = require('../controllers/projectController')
const TimesheetControllers=require('../controllers/timesheetController')

//main apis
router.post('/login',AuthControllers.login);
router.post('/signup',authUtils.authenticateJWT,AuthControllers.register);
router.put('/change_password',AuthControllers.change_password);
router.post('/forgot_password',AuthControllers.forgot_password);
router.post('/create_project',ProjectControllers.create_project);
router.post('/allocate_project',ProjectControllers.allocate_project);
router.get('/getUsersProjects',authUtils.authenticateJWT,ProjectControllers.getUsersProjects);
router.post('/getTimesheetData',authUtils.authenticateJWT,TimesheetControllers.RertreiveTimesheetPerWeek)
router.get('/getUserProject',authUtils.authenticateJWT,TimesheetControllers.RetreiveUserProject)
router.post('/CreateUpdateTimesheets',authUtils.authenticateJWT,TimesheetControllers.CreateUpdateTimesheets)

module.exports = router;