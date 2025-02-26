
const Feedback = require('../../models/candidate/Feedback');


const createFeedback = async (req, res) => {
    try {
      const { type, message, contact } = req.body;
      const userId = req.user.id; 
  
      const feedback = new Feedback({ userId, type, message, contact });
      await feedback.save();
  
      res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
      console.error("Error in createFeedback:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const getFeedbacks = async (req, res) => {
    try {
      const feedbacks = await Feedback.find().populate('userId', 'name email'); 
      res.json(feedbacks);
    } catch (error) {
      console.error("Error in getFeedbacks:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  const getFeedbackByUserId = async (req, res) => {
    const userId = req.user.id; 
  
    try {
      const feedbacks = await Feedback.find({ userId }); 
  
      if (!feedbacks.length) {
        return res.status(404).json({ message: 'No feedback found for this user.' });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };



module.exports = { createFeedback, getFeedbacks, getFeedbackByUserId };
