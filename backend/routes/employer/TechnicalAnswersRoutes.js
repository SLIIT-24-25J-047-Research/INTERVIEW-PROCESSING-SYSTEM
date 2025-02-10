const express = require('express');
const router = express.Router();
const { submitAnswers, getUserAnswers } = require('../../controllers/employer/TechnicalAnswersController');

router.post('/submit', submitAnswers);
router.get('/answers/:userId', getUserAnswers);

module.exports = router;
