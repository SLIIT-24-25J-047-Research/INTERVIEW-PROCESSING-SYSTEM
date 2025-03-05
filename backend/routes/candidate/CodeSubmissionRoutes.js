const express = require('express');
const router = express.Router();


const CodeSubmissionController = require('../../controllers/candidate/CodeSubmissionController');


router.post('/', CodeSubmissionController.createSubmission);
router.get('/all', CodeSubmissionController.getAllSubmissions);
router.get('/:id', CodeSubmissionController.getSubmissionById);
router.put('/:id', CodeSubmissionController.updateSubmission);
router.delete('/:id', CodeSubmissionController.deleteSubmission);



module.exports = router;

