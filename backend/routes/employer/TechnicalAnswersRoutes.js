const express = require('express');
const router = express.Router();
const { submitAnswers, getUserAnswers,getAllAnswersGroupedByInterview } = require('../../controllers/employer/TechnicalAnswersController');

router.post('/submit', submitAnswers);
router.get('/answers/:userId/:interviewId', getUserAnswers);
router.get('/answers/grouped', getAllAnswersGroupedByInterview);

module.exports = router;
