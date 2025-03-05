// models/candidate/CVSkills.js
const mongoose = require('mongoose');

const CVSkillsSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'UserCV', // Reference to the UserCV model
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'jobs', // Reference to the Job model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  skills: {
    type: [String], // Array of extracted skills
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CVSkills', CVSkillsSchema);