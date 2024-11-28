const mongoose = require('mongoose');

const candidateScoreSchema = new mongoose.Schema(
    {
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

    wcc: { 
        type: Number, 
        required: true 
    },

    cfc: {
         type: Number, 
         required: true 
    },

    cc: {
         type: Number, 
         required: true 
    },

    totalScore: { 
        type: Number, 
        required: true 
    }, // Pre-calculated for sorting

    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('CandidateScore', candidateScoreSchema);

