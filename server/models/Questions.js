const mongoose = require('mongoose');

// Define Schema for Consultant Questions
const consultantQuestionsSchema = new mongoose.Schema({
    q1: { type: String, required: true },
    q2: { type: String, required: true },
    q3: { type: String, required: true },
    q4: { type: String, required: true },
    q5: { type: String, required: true }
});

// Define Schema for Software Developer Questions
const softwareDeveloperQuestionsSchema = new mongoose.Schema({
    q1: { type: String, required: true },
    q2: { type: String, required: true },
    q3: { type: String, required: true },
    q4: { type: String, required: true },
    q5: { type: String, required: true }
});

// Define Schema for Intern Questions
const internQuestionsSchema = new mongoose.Schema({
    q1: { type: String, required: true },
    q2: { type: String, required: true },
    q3: { type: String, required: true },
    q4: { type: String, required: true },
    q5: { type: String, required: true }
});

// Define Schema for Common Questions
const commonQuestionsSchema = new mongoose.Schema({
    q1: { type: String, required: true },
    q2: { type: String, required: true },
    q3: { type: String, required: true },
    q4: { type: String, required: true },
    q5: { type: String, required: true }
});

// Create mongoose models for each schema
const ConsultantQuestions = mongoose.model('ConsultantQuestions', consultantQuestionsSchema);
const SoftwareDeveloperQuestions = mongoose.model('SoftwareDeveloperQuestions', softwareDeveloperQuestionsSchema);
const InternQuestions = mongoose.model('InternQuestions', internQuestionsSchema);
const CommonQuestions = mongoose.model('CommonQuestions', commonQuestionsSchema);

module.exports = { ConsultantQuestions, SoftwareDeveloperQuestions, InternQuestions, CommonQuestions };
