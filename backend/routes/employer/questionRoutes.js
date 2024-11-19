// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/employer/questionController');


router.get('/random', questionController.getRandomQuestions); 
router.get('/random2', questionController.getRandomQuestions2); 
router.post('/', questionController.createQuestion);  
router.get('/', questionController.getAllQuestions);   
router.get('/:id', questionController.getQuestionById); 
router.put('/:id', questionController.updateQuestion);  
router.delete('/:id', questionController.deleteQuestion); 

module.exports = router;
