const JobsModel = require ('../../models/employer/JobsModel.js');

// Create a new job
const createJob = async (req, res) => {
  try {
    // Find the last created job based on jobID (assuming jobID follows the pattern "vacancy01", "vacancy02", etc.)
    const lastJob = await JobsModel.findOne().sort({ jobID: -1 }); // Sort by jobID in descending order

    let newJobID = "vacancy01"; // Default to "vacancy01" if no jobs exist

    if (lastJob) {
      // Extract the number part from the last job's jobID (e.g., "vacancy01" -> 1)
      const lastJobNumber = parseInt(lastJob.jobID.replace("vacancy", ""));
      
      // Increment the number by 1
      const newJobNumber = lastJobNumber + 1;
      
      // Generate the new jobID (padding with leading zeros to maintain two digits)
      newJobID = `vacancy${String(newJobNumber).padStart(2, '0')}`;
    }

    // Create a new job with the generated jobID
    const newJob = new JobsModel({
      ...req.body,  // The rest of the job details come from the request body
      jobID: newJobID, // Set the new jobID
    });

    await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Failed to create job", error: error.message });
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