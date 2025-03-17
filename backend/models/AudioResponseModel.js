const mongoose = require('mongoose');

const questionResponseSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'non-technical-questions' 
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
    }
});

const audioResponseSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'non-technical-interviewschedules' 
    },
    responses: [questionResponseSchema], 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster querying by interviewId
audioResponseSchema.index({ interviewId: 1 });

const AudioResponse = mongoose.model('AudioResponse', audioResponseSchema);

module.exports = AudioResponse;