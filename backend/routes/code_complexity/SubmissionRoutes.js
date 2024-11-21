const express = require('express');
const router = express.Router();

// Correctly import the SubmissionController
const SubmissionController = require('../../controllers/code_complexity/SubmissionController');

// Define your routes
router.post('/', SubmissionController.createSubmission);
router.get('/', SubmissionController.getSubmission);
router.put('/', SubmissionController.updateSubmission);
router.delete('/', SubmissionController.deleteSubmission);

module.exports = router;

