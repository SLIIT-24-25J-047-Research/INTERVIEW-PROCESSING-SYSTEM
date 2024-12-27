const express = require('express');
const router = express.Router();
const technicalInterviewController = require('../../controllers/employer/TechInterviewController');


router.post('/schedule', technicalInterviewController.createTechnicalInterview);
router.get('/schedules', technicalInterviewController.getAllTechnicalInterviews);
router.get('/schedule/:id', technicalInterviewController.getTechnicalInterviewById);
router.put('/schedule/:id', technicalInterviewController.updateTechnicalInterview);
router.delete('/schedule/:id', technicalInterviewController.deleteTechnicalInterview);

module.exports = router;
