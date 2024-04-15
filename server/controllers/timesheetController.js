const timesheetModel = require("../models/TimesheetModel");
const user = require("../models/User");
const project = require("../models/Project");
const projectAssignmentModel = require("../models/ProjectAllocate");
const feedbackModel = require("../models/feedback");
const {
  ConvertTimesheetFormat,
  RetreiveProjectName,
} = require("../utils/timesheetUtils");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const RertreiveTimesheetPerWeek = async (req, res) => {
  try {
    const userEmail = req.data.email;
    const { startPeriod, endPeriod } = req.body;
    const timeSheetdata = await timesheetModel.find({
      email: userEmail,
      start_period: startPeriod,
      end_period: endPeriod,
      visible: true,
    });

    if (timeSheetdata.length !== 0) {
      res.json({
        message: "Timesheet data sent",
        payload: ConvertTimesheetFormat(timeSheetdata),
      });
    } else {
      const newTimeSheet = new timesheetModel({
        UID: Math.floor(100000 + Math.random() * 900000).toString(),
        email: userEmail,
        PID: "",
        activity: "",
        comments: "",
        start_period: startPeriod,
        end_period: endPeriod,
        mon: 0,
        tue: 0,
        wed: 0,
        thur: 0,
        fri: 0,
        sat: 0,
        sun: 0,
        created_at: new Date(),
      });

      try {
        const result = await newTimeSheet.save();
        res.json({
          message: "Timesheet data sent",
          payload: ConvertTimesheetFormat([result]),
        });
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "unable to retrieve timesheet data" });
  }
};

const RetreiveUserProject = async (req, res) => {
  try {
    const userEmail = req.data.email;

    const userProjects = await projectAssignmentModel.find({
      email: userEmail,
    });

    if (userProjects.length !== 0) {
      const PIDs = userProjects.map((project) => project.PID);
      const projects = await project.find({ PID: { $in: PIDs } });
      const projectMap = {};
      projects.forEach((project) => {
        projectMap[project.PID] = project.name;
      });
      const userProjectsWithName = userProjects.map((project) => ({
        ...project.toObject(),
        name: projectMap[project.PID],
      }));
      res.json({
        message: "Projects sent",
        payload: userProjectsWithName,
      });
    } else {
      res.json({
        message: "Projects sent",
        payload: [{ PID: "0", name: "bench" }],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Unable to retrieve project data" });
  }
};

const CreateUpdateTimesheets = async (req, res) => {
  try {
    const data = req.body;

    for (const [key, value] of Object.entries(data)) {
      const existingTimesheet = await timesheetModel.findOne({
        UID: value.UID,
        email: value.email,
        start_period: value.start_period,
        end_period: value.end_period,
      });

      if (existingTimesheet) {
        await timesheetModel.updateOne(
          {
            UID: value.UID,
            email: value.email,
            start_period: value.start_period,
            end_period: value.end_period,
          },
          {
            $set: value,
          }
        );
        console.log(`Timesheet entry updated for UID ${value.UID}`);
      } else {
        const newTimesheet = new timesheetModel(value);
        await newTimesheet.save();
        console.log(`New timesheet entry created for UID ${value.UID}`);
      }
    }

    res
      .status(200)
      .json({ message: "Timesheets created/updated successfully" });
  } catch (error) {
    console.error("Error creating/updating timesheets:", error);
    res.status(500).json({ message: "Error creating/updating timesheets" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aadishnagarajan@gmail.com",
    pass: "uken xfzb payx mzca",
  },
});

cron.schedule("0 10 * * 5", async () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to Sunday of current week
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); // Set to Saturday of current week
  const users = await user.find();

  for (const user of users) {
    const timesheet = await timesheetModel.findOne({
      email: user.email,
      start_period: { $lte: endDate },
      end_period: { $gte: startDate },
    });

    if (!timesheet) {
      transporter.sendMail(
        {
          from: "aadishnagarajan@gmail.com",
          to: user.email,
          subject: "Reminder: Submit your timesheet & feedback",
          text: "This is a reminder to submit your timesheet & feedback for the current week.",
        },
        (err, info) => {
          if (err) {
            console.error("Error sending email:", err);
          } else {
            console.log("Email sent:", info.response);
          }
        }
      );
    } else if (!timesheet.flag) {
      transporter.sendMail(
        {
          from: "aadishnagarajan@gmail.com",
          to: user.email,
          subject: "Reminder: Submit your feedback",
          text: "This is a reminder to submit your feedback for the current week.",
        },
        (err, info) => {
          if (err) {
            console.error("Error sending email:", err);
          } else {
            console.log("Email sent:", info.response);
          }
        }
      );
    }
  }
});

const checkTimesheet = async (req, res) => {
  try {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to Sunday of current week
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    const userEmail = req.data.email; // Assuming user email is stored in req.user.email after authentication
    const timesheet = await timesheetModel.findOne({
      email: userEmail,
      start_period: { $lte: endDate },
      end_period: { $gte: startDate },
    });
    if (timesheet == null) {
      res.json({ hasEnteredTimesheet: false });
    } else {
      res.json({ hasEnteredTimesheet: true });
    }
  } catch (error) {
    console.error("Error checking timesheet:", error);
    res.status(500).json({ message: "Error checking timesheet" });
  }
};

const checkFeedback = async (req, res) => {
  try {
    const userEmail = req.data.email;
    const feedback = await feedbackModel.findOne({ email: userEmail });

    if (feedback == null) {
      res.json({ hasEnteredFeedback: false });
    } else {
      res.json({ hasEnteredFeedback: true });
    }
  } catch (error) {
    console.error("Error checking feedback:", error);
    res.status(500).json({ message: "Error checking feedback" });
  }
};

module.exports = {
  RertreiveTimesheetPerWeek,
  RetreiveUserProject,
  CreateUpdateTimesheets,
  checkTimesheet,
  checkFeedback,
};
