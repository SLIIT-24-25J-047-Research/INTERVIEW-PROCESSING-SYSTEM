const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  userId: {  
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question', 
    required: true
  },


  code: {
    type: String,
    required: true
  },

  language: {
    type: String,
    default: "JavaScript" 
  },

  submittedAt: {
    type: Date, 
    default: Date.now
  },

  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Needs Improvement'], 
    default: 'Pending'
  },
  evaluationResult: {
      type: Object,  
      default: {}
  }
});


module.exports = mongoose.model('Submission', submissionSchema);
