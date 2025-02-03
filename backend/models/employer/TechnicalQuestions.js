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
        input: { type: String },
        expectedOutput: { type: String },
      },
    ],
    text: { type: String },
    blanks: [
      {
        id: { type: String },
        answer: { type: String },
      },
    ],
    items: [
      {
        id: { type: String },
        text: { type: String },
      },
    ],
    correctOrder: [{ type: String }],
    options: [{ type: String }],
    correctAnswer: { type: Number },
  },
});

module.exports = mongoose.model("TechnicalQuestion", QuestionSchema);
