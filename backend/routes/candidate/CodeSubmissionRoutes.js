const express = require('express');
const router = express.Router();

// Correctly import the SubmissionController
const CodeSubmissionController = require('../../controllers/candidate/CodeSubmissionController');

// Define your routes

router.post('/', CodeSubmissionController.createSubmission);
router.get('/all', CodeSubmissionController.getAllSubmissions);
router.get('/:id', CodeSubmissionController.getSubmissionById);
router.put('/:id', CodeSubmissionController.updateSubmission);
router.delete('/:id', CodeSubmissionController.deleteSubmission);



module.exports = router;

