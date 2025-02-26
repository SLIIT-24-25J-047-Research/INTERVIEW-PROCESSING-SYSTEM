// routes/feedbackRoutes.js
const express = require('express');
const { createFeedback, getFeedbacks } = require('../../controllers/candidate/FeedbackController');
const authMiddleware = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/send', authMiddleware, createFeedback);
router.get('/feedback', authMiddleware, getFeedbacks);

module.exports = router;
