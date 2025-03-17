const mongoose = require('mongoose');

const questionResponseSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'non-technical-questions' // Reference to the Question model
    },
    prediction: {
        type: mongoose.Schema.Types.Mixed, // Mixed type to store any kind of prediction data
        required: false // Optional, as prediction might fail
    },
    transcription: {
        type: String,
        required: false // Optional, as transcription might fail
    },
    similarityScores: {
        type: [Number], // Array of similarity scores
        required: false // Optional, as comparison might fail
    },
    isCorrect: {
        type: Boolean,
        required: false // Optional, as comparison might fail
    }
});

const audioResponseSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'non-technical-interviewschedules' // Assuming you have an Interview model
    },
    responses: [questionResponseSchema], // Array of question responses
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster querying by interviewId
audioResponseSchema.index({ interviewId: 1 });

const AudioResponse = mongoose.model('AudioResponse', audioResponseSchema);

module.exports = AudioResponse;