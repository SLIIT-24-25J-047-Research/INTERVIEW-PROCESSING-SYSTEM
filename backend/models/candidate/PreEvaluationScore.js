const mongoose = require('mongoose');

const preEvaluationScoreSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    professionalism: { type: String, required: true },
    mockupTestScore: { type: Number, required: true },
    totalPreEvaluationScore: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreEvaluationScore", preEvaluationScoreSchema);
