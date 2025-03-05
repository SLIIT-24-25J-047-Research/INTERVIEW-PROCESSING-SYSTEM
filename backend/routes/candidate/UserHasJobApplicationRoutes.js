
const express = require('express');
const router = express.Router();
const userJobApplicationController = require('../../controllers/candidate/UserHasJobApplicationController');

router.post('/apply', userJobApplicationController.addAppliedJob);
router.put('/update', userJobApplicationController.updateAppliedJob);
router.delete('/remove', userJobApplicationController.removeAppliedJob);
router.get('/', userJobApplicationController.getAllApplications);
router.get('/user/:userId', userJobApplicationController.getApplicationByUserId);
router.get('/job/:jobId', userJobApplicationController.getApplicationByJobId);

module.exports = router;
