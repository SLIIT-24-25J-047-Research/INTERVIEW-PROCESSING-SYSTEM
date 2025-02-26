// routes/feedbackRoutes.js
const express = require('express');
const { createFeedback, getFeedbacks, getFeedbackByUserId } = require('../../controllers/candidate/FeedbackController');
const authMiddleware = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/send', authMiddleware, createFeedback);
router.get('/get', authMiddleware, getFeedbacks);
router.get('/user/feedback', authMiddleware, getFeedbackByUserId);


module.exports = router;
