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

    
    if (!skills || skills.length === 0) {
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

   
    let existingEntry = await CVSkills.findOne({ fileId });
    if (existingEntry) {
      existingEntry.skills = skills;
      existingEntry.jobId = jobId;
      existingEntry.userId = userId;
      await existingEntry.save();
      return res.status(200).json({
        message: 'Skills updated successfully',
        data: existingEntry,
      });
    }

   
    const newCVSkills = new CVSkills({
      fileId,
      jobId,
      userId,
      skills,
    });

    await newCVSkills.save();

  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const job = await JobsModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Schedule Technical Interview 
    const techInterviewDate = new Date();
    techInterviewDate.setDate(techInterviewDate.getDate() + 3);
    const techInterviewTime = "2:00 PM";
    const duration = 60;
    const testLink = `https://elevate.com/${userId}-${jobId}-${Date.now()}`;

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
        status: 'scheduled'
      });

      await newTechInterview.save();

      const techNotification = new Notification({
        userId,
        message: `Your technical interview has been scheduled for ${techInterviewDate.toDateString()} at ${techInterviewTime}. Test link: ${testLink}`,
        interviewType: 'technical',
      });
      await techNotification.save();
    }
   // Schedule Non-Technical Interview
    const nonTechInterviewDate = new Date(techInterviewDate);
    nonTechInterviewDate.setDate(nonTechInterviewDate.getDate() + 5);
    const nonTechInterviewTime = "10:00 AM";
    const media = "MS Teams";

    // Check for existing non-technical interview
    const existingNonTechInterview = await InterviewSchedule.findOne({
      jobId,
      userId,
      status: { $in: ['scheduled'] },
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
        status: 'scheduled'
      });

      await newNonTechInterview.save();

      const nonTechNotification = new Notification({
        userId,
        message: `Your non-technical interview for job "${job.title}" has been scheduled on ${media} for ${nonTechInterviewDate.toDateString()} at ${nonTechInterviewTime}.`,
        interviewType: 'non-technical',
      });
      await nonTechNotification.save();
    }

    res.status(201).json({
      message: 'Skills saved successfully and interviews scheduled',
      data: {
        cvSkills: newCVSkills,
        technicalInterview: existingTechInterview ? 'Existing interview found' : await TechnicalInterviewSchedule.findOne({ userId, jobId }),
        nonTechnicalInterview: existingNonTechInterview ? 'Existing interview found' : await InterviewSchedule.findOne({ userId, jobId })
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
