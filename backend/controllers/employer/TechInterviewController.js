const TechnicalInterviewSchedule  = require('../../models/employer/TechnicalInterviewSchedule');

// Create 
exports.createTechnicalInterview = async (req, res) => {
  try {
    const { userId, userName, testDate, testTime, duration, testLink } = req.body;

    const interview = new TechnicalInterviewSchedule({
      userId,
      userName,
      testDate,
      testTime,
      duration,
      testLink
    });

    await interview.save();
    res.status(201).json({ message: 'Technical interview scheduled successfully', interview });
  } catch (err) {
    res.status(400).json({ message: 'Error scheduling technical interview', error: err.message });
  }
};

// Get all 
exports.getAllTechnicalInterviews = async (req, res) => {
  try {
    const interviews = await TechnicalInterviewSchedule.find().populate('userId', 'userName');
    res.status(200).json(interviews);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching interview schedules', error: err.message });
  }
};

// Get by ID
exports.getTechnicalInterviewById = async (req, res) => {
  try {
    const interview = await TechnicalInterviewSchedule.findById(req.params.id).populate('userId', 'userName');
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json(interview);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching interview schedule', error: err.message });
  }
};

// Update
exports.updateTechnicalInterview = async (req, res) => {
  try {
    const { testDate, testTime, duration, testLink, status } = req.body;

    const interview = await TechnicalInterviewSchedule.findByIdAndUpdate(
      req.params.id,
      { testDate, testTime, duration, testLink, status },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json({ message: 'Interview updated successfully', interview });
  } catch (err) {
    res.status(400).json({ message: 'Error updating interview schedule', error: err.message });
  }
};

// Delete a technical interview schedule
exports.deleteTechnicalInterview = async (req, res) => {
  try {
    const interview = await TechnicalInterviewSchedule.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json({ message: 'Interview schedule deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting interview schedule', error: err.message });
  }
};
