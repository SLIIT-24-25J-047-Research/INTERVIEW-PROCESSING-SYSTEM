const express = require('express');
const router = express.Router();
const technicalInterviewController = require('../../controllers/employer/TechInterviewController');


router.post('/T-schedule', technicalInterviewController.createTechnicalInterview);
router.get('/T-schedule/get', technicalInterviewController.getAllTechnicalInterviews);
router.get('/schedule/get/:id', technicalInterviewController.getTechnicalInterviewById);
router.put('/schedule/edit/:id', technicalInterviewController.updateTechnicalInterview);
router.delete('/schedule/:id', technicalInterviewController.deleteTechnicalInterview);

module.exports = router;
