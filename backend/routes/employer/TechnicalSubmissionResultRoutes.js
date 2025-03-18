const express = require('express');
const submissionResultController = require('../../controllers/employer/TechnicalSubmissionResultController');

const router = express.Router();

router.post('/submission-results', submissionResultController.saveSubmissionResult);

module.exports = router;