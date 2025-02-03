const Question = require("../../models/employer/TechnicalQuestions");

// Fetch all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch a single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuestion) return res.status(404).json({ error: "Question not found" });
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
