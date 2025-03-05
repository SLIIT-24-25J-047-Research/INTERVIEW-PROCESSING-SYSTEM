// controllers/candidate/CVSkillsController.js
const CVSkills = require('../../models/candidate/CVSkills');

const saveExtractedSkills = async (req, res) => {
  try {
    const { fileId, jobId, userId, skills } = req.body;

    if (!fileId || !jobId || !userId || !skills) {
      return res.status(400).json({ message: 'All fields are required' });
    }

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

module.exports = { saveExtractedSkills };