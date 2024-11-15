// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/employer/questionController');

// CRUD operations
router.get('/random', questionController.getRandomQuestions); // Use the controller for this route



router.post('/', questionController.createQuestion);  // Create a question
router.get('/', questionController.getAllQuestions);   // Get all questions
router.get('/:id', questionController.getQuestionById); // Get a question by ID
router.put('/:id', questionController.updateQuestion);  // Update a question
router.delete('/:id', questionController.deleteQuestion); // Delete a question

module.exports = router;
