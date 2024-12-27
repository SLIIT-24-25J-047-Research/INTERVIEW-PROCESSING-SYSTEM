const TechnicalInterviewSchedule  = require('../../models/employer/TechnicalInterviewSchedule');



// Create 
// exports.createTechnicalInterview = async (req, res) => {
//     try {
//       const { userId, userName, testDate, testTime, duration, testLink } = req.body;
  
//       // Check if the test link is unique
//       const existingTestLink = await TechnicalInterviewSchedule.findOne({ testLink });
//       if (existingTestLink) {
//         return res.status(400).json({ message: 'Test link must be unique. This link is already used by another user.' });
//       }
  
//       // Check if the interview date is at least 2 days after the application date
//       const applicationDate = new Date();  // Use the current date as the application date (you can modify this based on the actual application date)
//       const minInterviewDate = new Date(applicationDate);
//       minInterviewDate.setDate(applicationDate.getDate() + 2);  // Add 2 days to the current date
  
//       if (new Date(testDate) < minInterviewDate) {
//         return res.status(400).json({ message: 'The interview date must be at least 2 days after the application date.' });
//       }
  
//       // Check if the user already has an interview scheduled at the same time (same date + same time)
//       const existingSchedule = await TechnicalInterviewSchedule.findOne({
//         userId,
//         testDate: new Date(testDate), // Check if the user has an interview scheduled on the same date
//         testTime: testTime // Check if the user has an interview at the same time
//       });
  
//       if (existingSchedule) {
//         return res.status(400).json({ message: 'User already has a scheduled interview at this time on this date.' });
//       }
  
//       // Create a new technical interview schedule
//       const interview = new TechnicalInterviewSchedule({
//         userId,
//         userName,
//         testDate,
//         testTime,
//         duration,
//         testLink
//       });
  
//       await interview.save();
//       res.status(201).json({ message: 'Technical interview scheduled successfully', interview });
//     } catch (err) {
//       res.status(400).json({ message: 'Error scheduling technical interview', error: err.message });
//     }
//   };

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
