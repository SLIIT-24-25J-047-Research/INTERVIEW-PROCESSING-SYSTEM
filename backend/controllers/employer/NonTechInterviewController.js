const InterviewSchedule = require('../../models/employer/NonTechInterviewSchedule');
const User = require('../../models/User');

const scheduleInterview = async (req, res) => {
  try {
    const { userId, userName, interviewTime, media } = req.body;

    // Validate the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has an interview scheduled within the next 3 days
    const existingInterview = await InterviewSchedule.findOne({
      userId,
      interviewDate: { $gte: new Date(), $lt: new Date(new Date().setDate(new Date().getDate() + 3)) }, // Check for interviews within the next 3 days
    });

    if (existingInterview) {
      return res.status(400).json({ message: 'User already has an interview scheduled within the next 3 days. Please update the existing schedule.' });
    }

    // Schedule the interview
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 3);

    const newInterview = new InterviewSchedule({
      userId,
      userName,
      interviewDate,
      interviewTime,
      media,
    });

    await newInterview.save();

    return res.status(201).json({ message: 'Interview scheduled successfully', interview: newInterview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error scheduling interview', error });
  }
};


const editInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewDate, interviewTime, media } = req.body;

    // Find the interview that needs to be updated
    const interview = await InterviewSchedule.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Update the interview details
    interview.interviewDate = interviewDate || interview.interviewDate;
    interview.interviewTime = interviewTime || interview.interviewTime;
    interview.media = media || interview.media;
    interview.status = 'updated';

    await interview.save();

    return res.status(200).json({ message: 'Interview updated successfully', interview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating interview', error });
  }
};



  const cancelInterview = async (req, res) => {
    try {
      const { id } = req.params; // Interview ID
  
      const interview = await InterviewSchedule.findById(id);
      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }
  
      // Update the status to "canceled"
      interview.status = 'canceled';
  
      await interview.save();
  
      return res.status(200).json({ message: 'Interview canceled successfully', interview });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error canceling interview', error });
    }
  };

  const getAllSchedules = async (req, res) => {
    try {
      const schedules = await InterviewSchedule.find();
      return res.status(200).json({ message: 'All interview schedules retrieved', schedules });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving schedules', error });
    }
  }

  // Get a schedule by its ID
const getScheduleById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const schedule = await InterviewSchedule.findById(id);
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
  
      return res.status(200).json({ message: 'Schedule retrieved', schedule });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving schedule', error });
    }
  };

  const getSchedulesByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const schedules = await InterviewSchedule.find({ userId });
      if (schedules.length === 0) {
        return res.status(404).json({ message: 'No schedules found for this user' });
      }
  
      return res.status(200).json({ message: 'Schedules retrieved for user', schedules });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving schedules by user ID', error });
    }
  };

module.exports = { scheduleInterview, editInterview, cancelInterview, getAllSchedules, getScheduleById, getSchedulesByUserId };
