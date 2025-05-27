const CVSkills = require('../../models/candidate/CVSkills');
const Notification = require('../../models/candidate/Notification');
const TechnicalInterviewSchedule = require('../../models/employer/TechnicalInterviewSchedule');
const InterviewSchedule = require('../../models/employer/NonTechInterviewSchedule');
const User = require('../../models/User');
const JobsModel = require('../../models/employer/JobsModel');

const saveExtractedSkills = async (req, res) => {
  try {
    const { fileId, jobId, userId, skills } = req.body;

    if (!fileId || !jobId || !userId) {
      return res.status(400).json({ message: 'fileId, jobId, and userId are required' });
    }

    // if skills array is empty or not provided
    if (!skills || skills.length === 0) {
      // Create a notification 
      const notificationMessage = 'No skills were extracted from your uploaded CV. Please consider updating your CV with relevant skills.';
      const newNotification = new Notification({ 
        userId, 
        message: notificationMessage,
        interviewType: 'CV Upload' 
      });
      await newNotification.save();

      return res.status(200).json({
        message: 'No skills were extracted. User has been notified.',
        notification: newNotification
      });
    }

    // Check if data for this fileId already exists
    let existingEntry = await CVSkills.findOne({ fileId });
    if (existingEntry) {
      // Update the existing entry with the new skills if needed
      existingEntry.skills = skills;
      existingEntry.jobId = jobId;
      existingEntry.userId = userId;
      await existingEntry.save();
      return res.status(200).json({
        message: 'Skills updated successfully',
        data: existingEntry,
      });
    }

    // Create a new entry if it doesn't exist
    const newCVSkills = new CVSkills({
      fileId,
      jobId,
      userId,
      skills,
    });

    await newCVSkills.save();

    // Get user details for interview scheduling
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const job = await JobsModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Schedule Non-Technical Interview (3 days from now)
    const nonTechInterviewDate = new Date();
    nonTechInterviewDate.setDate(nonTechInterviewDate.getDate() + 3);
    const nonTechInterviewTime = "10:00 AM"; // Default time
    const media = "MS Teams"; // Default platform

    // Check for existing non-technical interview
    const existingNonTechInterview = await InterviewSchedule.findOne({
      jobId,
      userId,
      interviewDate: { $gte: new Date(), $lt: new Date(new Date().setDate(new Date().getDate() + 3)) },
    });

    if (!existingNonTechInterview) {
      const newNonTechInterview = new InterviewSchedule({
        userId,
        userName: user.name,
        interviewDate: nonTechInterviewDate,
        interviewTime: nonTechInterviewTime,
        media,
        jobId,
        skills,
      });

      await newNonTechInterview.save();

      const nonTechNotification = new Notification({
        userId,
        message: `Your non-technical interview for job "${job.title}" has been scheduled on ${media} for ${nonTechInterviewDate.toDateString()} at ${nonTechInterviewTime}.`,
        interviewType: 'non-technical',
      });
      await nonTechNotification.save();
    }

    // Schedule Technical Interview (5 days from now to allow time after non-technical)
    const techInterviewDate = new Date();
    techInterviewDate.setDate(techInterviewDate.getDate() + 5);
    const techInterviewTime = "2:00 PM"; // Default time
    const duration = 60; // Default duration in minutes
    const testLink = `https://tech-test-platform.com/${userId}-${jobId}-${Date.now()}`; // Generate unique test link

    // Check for existing technical interview
    const existingTechInterview = await TechnicalInterviewSchedule.findOne({
      userId,
      jobId,
      status: { $in: ['scheduled', 'in-progress'] },
    });

    if (!existingTechInterview) {
      const newTechInterview = new TechnicalInterviewSchedule({
        userId,
        userName: user.name,
        testDate: techInterviewDate,
        testTime: techInterviewTime,
        duration,
        testLink,
        jobId,
        skills,
      });

      await newTechInterview.save();

      const techNotification = new Notification({
        userId,
        message: `Your technical interview has been scheduled for ${techInterviewDate.toDateString()} at ${techInterviewTime}. Test link: ${testLink}`,
        interviewType: 'technical',
      });
      await techNotification.save();
    }

    res.status(201).json({
      message: 'Skills saved successfully and interviews scheduled',
      data: {
        cvSkills: newCVSkills,
        nonTechnicalInterview: existingNonTechInterview ? 'Existing interview found' : 'New interview scheduled',
        technicalInterview: existingTechInterview ? 'Existing interview found' : 'New interview scheduled'
      },
    });
  } catch (error) {
    console.error('Error saving skills:', error);
    res.status(500).json({
      message: 'Error saving skills and scheduling interviews',
      error: error.message,
    });
  }
};



const getCVSkillsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; 
    const cvSkills = await CVSkills.find({ userId }).populate('fileId jobId', 'skills fileId jobId');
    
    if (!cvSkills.length) {
      return res.status(404).json({ message: 'No CV skills found for this user' });
    }
    
    res.status(200).json(cvSkills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getCVSkillsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params; 
    const cvSkills = await CVSkills.find({ jobId }).populate('fileId userId', 'skills fileId userId');
    
    if (!cvSkills.length) {
      return res.status(404).json({ message: 'No CV skills found for this job' });
    }

    res.status(200).json(cvSkills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllCVSkillsGroupedByJobId = async (req, res) => {
  try {
    const cvSkills = await CVSkills.aggregate([
      {
        $group: {
          _id: "$jobId",
          skills: { $push: "$skills" }, 
          users: { $push: "$userId" }, 
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $project: {
          jobId: "$_id",
          jobTitle: "$jobDetails.title",
          skills: 1,
          users: 1,
        },
      },
    ]);
    
    if (!cvSkills.length) {
      return res.status(404).json({ message: 'No CV skills found' });
    }

    res.status(200).json(cvSkills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteCVSkills = async (req, res) => {
  try {
    const { cvSkillsId } = req.params; 
    
    const deletedCVSkills = await CVSkills.findByIdAndDelete(cvSkillsId);
    
    if (!deletedCVSkills) {
      return res.status(404).json({ message: 'CV skills not found' });
    }

    res.status(200).json({ message: 'CV skills deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  saveExtractedSkills,
  getCVSkillsByUserId,
  getCVSkillsByJobId,
  getAllCVSkillsGroupedByJobId,
  deleteCVSkills,
};
