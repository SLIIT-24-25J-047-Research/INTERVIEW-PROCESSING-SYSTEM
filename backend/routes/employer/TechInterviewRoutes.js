const express = require('express');
const router = express.Router();
const technicalInterviewController = require('../../controllers/employer/TechInterviewController');


router.post('/T-schedule', technicalInterviewController.createTechnicalInterview);
router.get('/T-schedule/get', technicalInterviewController.getAllTechnicalInterviews);
router.get('/T-schedule/get/:id', technicalInterviewController.getTechnicalInterviewById);
router.put('/T-schedule/edit/:id', technicalInterviewController.updateTechnicalInterview);
router.delete('/T-schedule/:id', technicalInterviewController.deleteTechnicalInterview);

module.exports = router;
