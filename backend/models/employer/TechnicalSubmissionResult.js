// models/ScoreModel.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  interviewScheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'InterviewSchedule'
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  scores: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Question'
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    }
  }],
  totalScore: {
    type: Number,
    required: true
  },
  maxPossibleScore: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('technicalsubmissionresults', scoreSchema);