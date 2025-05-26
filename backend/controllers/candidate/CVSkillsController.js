const CVSkills = require('../../models/candidate/CVSkills');
const Notification = require('../../models/candidate/Notification');

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

    res.status(201).json({
      message: 'Skills saved successfully',
      data: newCVSkills,
    });
  } catch (error) {
    console.error('Error saving skills:', error);
    res.status(500).json({
      message: 'Error saving skills',
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
