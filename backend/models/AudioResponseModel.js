const mongoose = require('mongoose');

const audioResponseSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'non-technical-questions' // Assuming you have a Question model
    },
    prediction: {
        type: mongoose.Schema.Types.Mixed, 
        required: false 
    },
    transcription: {
        type: String,
        required: false
    },
    similarityScores: {
        type: [Number], 
        required: false 
    },
    isCorrect: {
        type: Boolean,
        required: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster querying by questionId
audioResponseSchema.index({ questionId: 1 });

const AudioResponse = mongoose.model('AudioResponse', audioResponseSchema);

module.exports = AudioResponse;