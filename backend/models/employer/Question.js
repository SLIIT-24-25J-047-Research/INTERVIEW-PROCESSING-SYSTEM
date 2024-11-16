const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    skillGroupId: {
     type: mongoose.Schema.Types.ObjectId, ref: 'SkillGroup', required: true
    },
    text: {
        type: String,
        required: true
    },
    answers: {
        type: [String], 
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
