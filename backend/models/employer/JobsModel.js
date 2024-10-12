const mongoose = require('mongoose');

const JobsSchema = new mongoose.Schema(
  {
    jobID: {
      type: String,
      required: true,
      unique: true,
    },
    jobRole: {
      type: String,
      required: true,
      enum: ["software-engineer-intern", "software-engineer-associate"],
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: false,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
      default: "Full-time",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("jobs", JobsSchema);