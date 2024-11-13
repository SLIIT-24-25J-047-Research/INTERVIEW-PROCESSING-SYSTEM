// controllers/questionController.js
const Question = require('../../models/employer/Question');


exports.createQuestion = async (req, res) => {
    try {
      const { skillGroupId, text, answers } = req.body;
      const question = new Question({ skillGroupId, text, answers });
      await question.save();
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
      const questions = await Question.find().populate('skillGroupId', 'name');  
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getRandomQuestions = async (req, res) => {
   
    try {
        const questions = await Question.find();
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions available.' });
        }
        // Shuffle 
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
        const numQuestionsToFetch = 3; 
        const randomQuestions = shuffledQuestions.slice(0, numQuestionsToFetch);
        
        res.status(200).json(randomQuestions);
    } catch (error) {
        console.error('Error fetching random questions:', error);
        res.status(500).json({ message: 'Error fetching random questions', error });
    }
};

