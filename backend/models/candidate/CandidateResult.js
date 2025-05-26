// backend/models/candidate/CandidateResult.js
const mongoose = require('mongoose');

const CandidateResultSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // Ensures each email can only have one result
  },
  score: {
    type: Number,
    required: true,
  },
  testDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MockupResult', CandidateResultSchema);
