const mongoose = require('mongoose');

const audioResponseSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question' // Assuming you have a Question model
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