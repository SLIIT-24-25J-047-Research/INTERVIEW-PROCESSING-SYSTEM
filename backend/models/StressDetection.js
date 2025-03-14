const mongoose = require('mongoose');

const stressDetectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interviewScheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technical-InterviewSchedule',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobs',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechnicalQuestion',
        required: true
    },
    emotion: {
        type: String,
        required: true
    },
    predictionValues: {
        type: [Number],
        required: true
    },
    stressLevel: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('StressDetection', stressDetectionSchema);
