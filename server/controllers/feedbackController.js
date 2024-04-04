const feedbackModel=require("../models/feedback")
const CreateFeedbackEntry = async (req, res) => {

  try {

      const email = req.data.email;
      const role = req.data.role;

      const { projectId, start_period, end_period, feedback } = req.body;


      const newFeedback = new feedbackModel({
          email: email,
          projectId: projectId,
          role: role,
          start_period: start_period, // Example start date
          end_period: end_period, // Example end date
          q1: feedback['q1'],
          q2: feedback['q2'],
          q3: feedback['q3'],
          q4: feedback['q4'],
          q5: feedback['q5'],
          q6: feedback['q6'],
          comments: feedback['comments'],
          created_at: new Date()
      });

      try {
          const result = await newFeedback.save();
          console.log(result);
          res.json({ message: "Feedback data saved" });
      } catch (error) {
          console.error(error);
      }

  } catch (error) {
      console.log(error);
      res.json({ "message": "unable to create feedback entry" })
  }
}
module.exports = {
  CreateFeedbackEntry
}