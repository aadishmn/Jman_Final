const mongoose = require('mongoose');
const { ConsultantQuestions, SoftwareDeveloperQuestions, InternQuestions, CommonQuestions } = require('../models/Questions');

const questionController = async () => {
    try {
        // Create and save questions for Consultant
        const consultantQuestions = new ConsultantQuestions({
            q1: "How effectively did you address the client's needs this week?",
            q2: "How well did you collaborate with the client to achieve project goals this week?",
            q3: "On a scale of 1 to 5, how satisfied are you with the level of client engagement this week?",
            q4: "How would you rate the client's understanding of project requirements this week?",
            q5: "How successful were your client presentations or meetings this week?"
        });
        await consultantQuestions.save();
        console.log('Consultant questions saved to database');

        // Create and save questions for Software Developer
        const softwareDeveloperQuestions = new SoftwareDeveloperQuestions({
            q1: "How satisfied are you with the technical aspects of the project this week?",
            q2: "How well did the project adhere to the specifications this week?",
            q3: "On a scale of 1 to 5, how satisfied are you with the technical aspects of the project this week?"
        });
        await softwareDeveloperQuestions.save();
        console.log('Software Developer questions saved to database');

        // Create and save questions for Intern
        const internQuestions = new InternQuestions({
            q1: "How well did the project meet the client's requirements this week?",
            q2: "How likely are you to recommend our services to others this week?",
            q3: "On a scale of 1 to 5, how satisfied are you with the consulting services provided this week?"
        });
        await internQuestions.save();
        console.log('Intern questions saved to database');

        // Create and save common questions
        const commonQuestions = new CommonQuestions({
            q1: "How would you rate the project overall?",
            q2: "How satisfied are you with the project management this week?",
            q3: "How effective was the communication during the project this week?",
            q4: "How well did the project meet the deadlines this week?",
            q5: "How would you rate the quality of work delivered this week?"
        });
        await commonQuestions.save();
        console.log('Common questions saved to database');
    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = questionController;
