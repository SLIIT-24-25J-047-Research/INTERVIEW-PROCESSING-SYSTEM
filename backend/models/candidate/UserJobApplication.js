
const mongoose = require('mongoose');

const userHasJobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobs', // Reference to the Job model
  }],
  interviewData: {
    type: [{
      interviewDate: { type: Date },
      interviewTime: { type: String },
      status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
    }],
    default: [],
  },
});

const UserJobApplication = mongoose.model('UserHasJobApplication', userHasJobApplicationSchema);

module.exports = UserJobApplication;
