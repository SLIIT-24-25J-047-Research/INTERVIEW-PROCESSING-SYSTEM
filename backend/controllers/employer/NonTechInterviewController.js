const Notification = require('../../models/candidate/Notification');
const JobsModel = require('../../models/employer/JobsModel');
const InterviewSchedule = require('../../models/employer/NonTechInterviewSchedule');
const User = require('../../models/User');

const scheduleInterview = async (req, res) => {
  try {
    const { userId, userName, interviewTime, media, jobId  } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const job = await JobsModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user already has an interview scheduled within the next 3 days
    const existingInterview = await InterviewSchedule.findOne({
      jobId,
      userId,
      interviewDate: { $gte: new Date(), $lt: new Date(new Date().setDate(new Date().getDate() + 3)) }, // Check for interviews within the next 3 days
    });

    if (existingInterview) {
      return res.status(400).json({ message: 'User already has an interview scheduled within the next 3 days. Please update the existing schedule.' });
    }


    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 3);

    const newInterview = new InterviewSchedule({
      userId,
      userName,
      interviewDate,
      interviewTime,
      media,
      jobId,
    });

    await newInterview.save();
    const notification = new Notification({
      userId,
      message: `Your interview for job "${job.title}" has been scheduled on ${media} for ${interviewDate.toDateString()} at ${interviewTime}.`,
      interviewType: 'non-technical',
    });

    await notification.save();

    return res.status(201).json({ message: 'Interview scheduled successfully', interview: newInterview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error scheduling interview', error });
  }
};


const editInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewDate, interviewTime, media, jobId  } = req.body;


    const interview = await InterviewSchedule.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const currentDate = new Date();
    const interviewScheduledDate = new Date(interview.interviewDate);

    // Block updates attempted on the interview day
    if (currentDate.toISOString().split('T')[0] === interviewScheduledDate.toISOString().split('T')[0]) {
      return res.status(400).json({
        message: 'Cannot update the interview on the same day as the interview date.',
      });
    }


    if (interviewDate && new Date(interviewDate) < currentDate) {
      return res.status(400).json({
        message: 'The updated interview date cannot be in the past.',
      });
    }

    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      interview.jobId = jobId;
    }


    interview.interviewDate = interviewDate || interview.interviewDate;
    interview.interviewTime = interviewTime || interview.interviewTime;
    interview.media = media || interview.media;
    interview.status = 'updated';

    await interview.save();

    const notification = new Notification({
      userId: interview.userId,
      message: `Your Non technical interview has been updated. New date: ${interviewDate}, time: ${interviewTime}, `,
      interviewType: 'non-technical',
    });

    await notification.save();

    return res.status(200).json({ message: 'Interview updated successfully', interview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating interview', error });
  }
};




const cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await InterviewSchedule.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }


    interview.status = 'canceled';

    await interview.save();
    const notification = new Notification({
      userId: interview.userId,
      message: `Your Non technical interview has been Canceled.`,
      interviewType: 'non-technical',
    });

    await notification.save();


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

// Get by  ID
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

    const schedules = await InterviewSchedule.find({ userId }).populate('jobId', 'title description'); 
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
