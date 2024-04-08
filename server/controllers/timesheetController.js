const timesheetModel = require("../models/TimesheetModel");
const user = require("../models/User");
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
    const user = req.data.email;
    const { startPeriod, endPeriod } = req.body;
    const timeSheetdata = await timesheetModel.find({
      email: user,
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
        email: user,
        PID: "", // Assuming PID is empty initially
        activity: "",
        comments: "",
        start_period: startPeriod, // Example start date
        end_period: endPeriod, // Example end date
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
        console.log(result);
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
    res.json({ message: "unable to retreive timesheet data" });
  }
};

const RetreiveUserProject = async (req, res) => {
  try {
    const userproject = await projectAssignmentModel.find({
      email: req.data.email,
    });

    if (userproject.length !== 0) {
      res.json({
        message: "Project sent",
        payload: await RetreiveProjectName(userproject),
      });
    } else {
      res.json({
        message: "Project sent",
        payload: [{ PID: "0", name: "bench" }],
      });
    }
  } catch {
    console.log(error);
    res.json({ message: "unable to retreive project data" });
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
        // If the timesheet entry doesn't exist, create a new one
        const newTimesheet = new timesheetModel(value);
        console.log(newTimesheet);
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

//   cron.schedule('0 10 * * 5', async () => {
//     // Get the start and end date for the current week (adjust logic based on your requirements)
//     const currentDate = new Date();
//     const startDate = new Date(currentDate);
//     startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to Sunday of current week
//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + 6); // Set to Saturday of current week

//     const usersWithoutFeedback = await timesheetModel.find({
//         start_period: { $lte: endDate },
//         end_period: { $gte: startDate },
//         flag: false // Assuming 'flag' indicates whether feedback is submitted or not
//     }).select('email');

//     usersWithoutFeedback.forEach(user => {
//         transporter.sendMail({
//             from: 'dhiyanesh7338942092@gmail.com',
//             to: user.email,
//             subject: 'Reminder: Please fill your feedback',
//             text: 'This is a reminder to fill your feedback for the current week.'
//         }, (err, info) => {
//             if (err) {
//                 console.error('Error sending email:', err);
//             } else {
//                 console.log('Email sent:', info.response);
//             }
//         });
//     });
// });

cron.schedule("0 10 * * 5", async () => {
  // Get the start and end date for the current week (assuming the week starts on Sunday)
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to Sunday of current week
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); // Set to Saturday of current week

  // Find all users
  const users = await user.find();

  // Loop through each user
  for (const user of users) {
    // Check if the user has a corresponding timesheet entry for the current week
    const timesheet = await timesheetModel.findOne({
      email: user.email,
      start_period: { $lte: endDate },
      end_period: { $gte: startDate },
    });

    // If there's no timesheet entry or if the flag is false, trigger the email notification
    if (!timesheet) {
      // Send email notification to the user
      transporter.sendMail(
        {
          from: "dhiyanesh7338942092@gmail.com",
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
          from: "dhiyanesh7338942092@gmail.com",
          to: "aadishmn@gmail.com",
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
      res.json({ hasEnteredTimesheet: true });
    } else {
      res.json({ hasEnteredTimesheet: false });
    }
  } catch (error) {
    console.error("Error checking timesheet:", error);
    res.status(500).json({ message: "Error checking timesheet" });
  }
};

const checkFeedback = async (req, res) => {
  try {
    const userEmail = req.data.email;
    console.log(userEmail); // Assuming user email is stored in req.user.email after authentication
    const feedback = await feedbackModel.findOne({ email: userEmail });

    if (feedback == null) {
      res.json({ hasEnteredFeedback: true });
    } else {
      res.json({ hasEnteredFeedback: false });
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
