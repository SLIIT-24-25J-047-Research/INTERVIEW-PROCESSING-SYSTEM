const Question = require("../../models/employer/TechnicalQuestions");

// get all 
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();

    // Map the fetched questions to the desired response format
    const formattedQuestions = questions.map(question => ({
      _id: question._id.toString(), // Convert ObjectId to string for consistency
      type: question.type,
      title: question.title,
      description: question.description,
      timeLimit: question.timeLimit,
      points: question.points,
      difficulty: question.difficulty,
      __v: question.__v, // Include __v if needed
      content: {
        initialCode: question.content.initialCode,
        language: question.content.language,
        testCases: question.content.testCases.map(testCase => ({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          _id: testCase._id.toString(), // Convert ObjectId to string
        })),
        text: question.content.text,
        blanks: question.content.blanks,
        items: question.content.items,
        correctOrder: question.content.correctOrder,
        options: question.content.options,
        correctAnswer: question.content.correctAnswer,
        
        // New fields for additional question types
        dataset: question.content.dataset
          ? {
              data: question.content.dataset.data,
              expectedVisualization: question.content.dataset.expectedVisualization,
            }
          : undefined,

        mechanics: question.content.mechanics
          ? {
              worldConfig: question.content.mechanics.worldConfig,
              expectedBehavior: question.content.mechanics.expectedBehavior,
            }
          : undefined,

        puzzle: question.content.puzzle
          ? {
              initialState: question.content.puzzle.initialState,
              goalState: question.content.puzzle.goalState,
              rules: question.content.puzzle.rules,
            }
          : undefined,
      },
    }));

    // Send the formatted response
    res.json(formattedQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create 
exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update 
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

// Delete 
exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
