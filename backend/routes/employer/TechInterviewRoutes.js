const express = require('express');
const router = express.Router();
const technicalInterviewController = require('../controllers/technicalInterviewController');

// Create a new technical interview schedule
router.post('/schedule', technicalInterviewController.createTechnicalInterview);

// Get all technical interview schedules
router.get('/schedules', technicalInterviewController.getAllTechnicalInterviews);

// Get a specific technical interview schedule by ID
router.get('/schedule/:id', technicalInterviewController.getTechnicalInterviewById);

// Update a technical interview schedule
router.put('/schedule/:id', technicalInterviewController.updateTechnicalInterview);

// Delete a technical interview schedule
router.delete('/schedule/:id', technicalInterviewController.deleteTechnicalInterview);

module.exports = router;
