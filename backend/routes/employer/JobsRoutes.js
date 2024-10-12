const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById, getJobsByJobRole, updateJobById, deleteJobById } = require ('../../controllers/employer/JobsController.js');

// Route to create a new job
router.post("/add", createJob); // Updated this line

// Route to get all jobs
router.get("/all", getAllJobs);

// Route to get a job by its MongoDB ObjectId
router.get("/:id", getJobById);

// Route to get jobs by jobRole (software-engineer-intern, software-engineer-associate)
router.get("/role/:jobRole", getJobsByJobRole);

// Route to update a job by its MongoDB ObjectId
router.put("/:id", updateJobById);

// Route to delete a job by its MongoDB ObjectId
router.delete("/:id", deleteJobById);

module.exports = router;
