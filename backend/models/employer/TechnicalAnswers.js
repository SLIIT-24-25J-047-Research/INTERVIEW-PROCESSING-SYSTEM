const mongoose = require('mongoose');

const TecInterviewAnswerSchema = new mongoose.Schema({
  interviewId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: String, required: true },
      response: { type: mongoose.Schema.Types.Mixed, required: true },
      timeTaken: { type: Number, required: false }, 
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('technicalAnswers', TecInterviewAnswerSchema);
