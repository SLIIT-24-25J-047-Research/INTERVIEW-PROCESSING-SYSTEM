
const UserJobApplication = require('../../models/candidate/UserJobApplication');

// Add 
const addAppliedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    let userJobApplication = await UserJobApplication.findOne({ userId });
    
    if (!userJobApplication) {
      userJobApplication = new UserJobApplication({
        userId,
        appliedJobs: [jobId],
      });
    } else {
      // If the user has already applied for the job, don't add it again
      if (!userJobApplication.appliedJobs.includes(jobId)) {
        userJobApplication.appliedJobs.push(jobId);
      }
    }

    await userJobApplication.save();
    return res.status(200).json({ message: 'Job applied successfully', userJobApplication });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error applying for job', error });
  }
};

// Update 
const updateAppliedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const userJobApplication = await UserJobApplication.findOne({ userId });

    if (!userJobApplication) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!userJobApplication.appliedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job not found in applied jobs' });
    }

    // Update interview data or any other fields if necessary
    userJobApplication.interviewData.push(req.body.interviewData); 
    await userJobApplication.save();

    return res.status(200).json({ message: 'Applied job updated successfully', userJobApplication });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating applied job', error });
  }
};

// Remove 
const removeAppliedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const userJobApplication = await UserJobApplication.findOne({ userId });

    if (!userJobApplication) {
      return res.status(404).json({ message: 'User not found' });
    }

    userJobApplication.appliedJobs = userJobApplication.appliedJobs.filter(
      (job) => job.toString() !== jobId
    );

    await userJobApplication.save();
    return res.status(200).json({ message: 'Job removed from applied jobs', userJobApplication });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error removing applied job', error });
  }
};

// Get all
const getAllApplications = async (req, res) => {
  try {
    const userJobApplications = await UserJobApplication.find()
      .populate('appliedJobs')
      .populate('userId');

    return res.status(200).json({ message: 'Job applications retrieved', userJobApplications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving job applications', error });
  }
};

// Get by user ID
const getApplicationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const userJobApplication = await UserJobApplication.findOne({ userId })
      .populate('appliedJobs')
      // .populate('userId');

    if (!userJobApplication) {
      return res.status(404).json({ message: 'User job application not found' });
    }

    return res.status(200).json({ message: 'Job application retrieved for user', userJobApplication });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving job application by user ID', error });
  }
};

// Get by job ID
const getApplicationByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const userJobApplications = await UserJobApplication.find({ appliedJobs: jobId })
      .populate('userId')
      .populate('appliedJobs');

    return res.status(200).json({ message: 'Job applications retrieved for job', userJobApplications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving job application by job ID', error });
  }
};

module.exports = {
  addAppliedJob,
  updateAppliedJob,
  removeAppliedJob,
  getAllApplications,
  getApplicationByUserId,
  getApplicationByJobId,
};
