const mongoose = require('mongoose');

const submissionResultSchema = new mongoose.Schema({
  submissionId: { type: String, required: true },
  userId: { type: String, required: true },
  interviewScheduleId: { type: String, required: true },
  jobId: { type: String, required: true },
  questions: [{
    questionId: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    feedback: { type: String },
    isCorrect: { type: Boolean },
    testResults: [{
      passed: { type: Boolean },
      input: { type: String },
      expectedOutput: { type: String },
      actualOutput: { type: String }
    }],
    mechanicsValidation: {
      behaviorMatched: { type: Boolean },
      physicsCorrect: { type: Boolean },
      collisionsHandled: { type: Boolean }
    }
  }],
  totalScore: { type: Number, required: true },
  maxPossibleScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TechnicalSubmissionResult', submissionResultSchema);