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
    default: "JavaScript" // Default language
  },

  submittedAt: {
    type: Date, 
    default: Date.now
  },

  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Needs Improvement'], // Allowed values
    default: 'Pending'
  },
  evaluationResult: {
      type: Object,  // Store evaluation result as an object
      default: {}
  }
});

// Export the model
module.exports = mongoose.model('Submission', submissionSchema);
