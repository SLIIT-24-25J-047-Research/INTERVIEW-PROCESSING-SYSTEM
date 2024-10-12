const JobsModel = require ('../../models/employer/JobsModel.js');

// Create a new job
const createJob = async (req, res) => {
  try {
    const newJob = new JobsModel(req.body);
    await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create job", error: error.message });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobsModel.find();
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// Get a job by MongoDB ObjectId
const getJobById = async (req, res) => {
  try {
    const job = await JobsModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch job", error: error.message });
  }
};

// Get jobs by jobRole
const getJobsByJobRole = async (req, res) => {
  try {
    const jobs = await JobsModel.find({ jobRole: req.params.jobRole });
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// Update a job by MongoDB ObjectId
const updateJobById = async (req, res) => {
  try {
    const updatedJob = await JobsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update job", error: error.message });
  }
};

// Delete a job by MongoDB ObjectId
const deleteJobById = async (req, res) => {
  try {
    const deletedJob = await JobsModel.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res
      .status(200)
      .json({ message: "Job deleted successfully", job: deletedJob });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete job", error: error.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, getJobsByJobRole, updateJobById, deleteJobById };