const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  points: { type: Number, required: true },
  difficulty: { type: String, required: true },
  content: {
    initialCode: { type: String },
    language: { type: String },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
    text: { type: String },
    blanks: [
      {
        id: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    items: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    correctOrder: [{ type: String }],
    options: [{ type: String }],
    correctAnswer: { type: Number },
  },
});

module.exports = mongoose.model("TechnicalQuestion", QuestionSchema);
