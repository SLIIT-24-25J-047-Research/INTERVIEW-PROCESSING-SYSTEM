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
    },
    marks: {
        type: Number,
        required: false,
        default: 0
    }
});

const audioResponseSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'non-technical-interviewschedules' 
    },
    userId: {
        type: String,
        required: true,
        default: 'defaultUserId'
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobs',
        required: false
    },
    responses: [questionResponseSchema], 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster querying by interviewId
audioResponseSchema.index({ interviewId: 1 });
// Add indices for new fields for faster querying
audioResponseSchema.index({ userId: 1 });
audioResponseSchema.index({ jobId: 1 });

const AudioResponse = mongoose.model('AudioResponse', audioResponseSchema);

module.exports = AudioResponse;