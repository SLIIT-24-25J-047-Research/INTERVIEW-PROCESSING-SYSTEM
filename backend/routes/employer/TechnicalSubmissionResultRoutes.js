const express = require('express');
const submissionResultController = require('../../controllers/employer/TechnicalSubmissionResultController');

const router = express.Router();

router.post('/submission-results', submissionResultController.saveScores);
router.get('/:interviewScheduleId', submissionResultController.getScores);

module.exports = router;