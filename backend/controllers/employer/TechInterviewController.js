const TechnicalInterviewSchedule  = require('../../models/employer/TechnicalInterviewSchedule');



// Create 
exports.createTechnicalInterview = async (req, res) => {
    try {
      const { userId, userName, duration, testLink } = req.body;
  
      // Check if the test link is unique
      const existingTestLink = await TechnicalInterviewSchedule.findOne({ testLink });
      if (existingTestLink) {
        return res.status(400).json({ message: 'Test link must be unique. This link is already used by another user.' });
      }
  
      //  (2 days from today)
      const today = new Date();
      const testDate = new Date();
      testDate.setDate(today.getDate() + 0); 
      const testTime = "10:00 AM"; // Default time 
  
   
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

      const interview = await TechnicalInterviewSchedule.findById(req.params.id);
  
      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }
  
      const currentDate = new Date();
      const interviewDate = new Date(interview.testDate);
  
      // Block updates attempted on the interview day
      if (currentDate.toISOString().split('T')[0] === interviewDate.toISOString().split('T')[0]) {
        return res.status(400).json({
          message: 'Cannot update the interview on the same day as the interview date.',
        });
      }
  
      // Check if the new test date is in the past
      if (testDate && new Date(testDate) < currentDate) {
        return res.status(400).json({ message: 'The updated interview date cannot be in the past.' });
      }
  
      // Update the interview schedule
      const updatedInterview = await TechnicalInterviewSchedule.findByIdAndUpdate(
        req.params.id,
        { testDate, testTime, duration, testLink, status },
        { new: true }
      );
  
      res.status(200).json({ message: 'Interview updated successfully', updatedInterview });
    } catch (err) {
      res.status(400).json({ message: 'Error updating interview schedule', error: err.message });
    }
  };
  
  
  

// Delete
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
