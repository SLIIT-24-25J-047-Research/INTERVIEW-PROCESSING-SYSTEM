const mongoose = require('mongoose');

const codeCalculationSchema = new mongoose.Schema(
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

    code: {
         type: String, 
         required: true 
    },

    cc: { 
        type: Number, 
        required: true 
    }, // Cyclomatic Complexity

    wcc: {
         type: Number, 
         required: true 
    }, // Weighted Composite Complexity

    cfc: {
         type: Number, 
         required: true 
    }, // Cognitive Functional Size

    language: { 
        type: String, 
        default: 'JavaScript' 
    }, // Optional, can be any language

    status: {
         type: String, 
         enum: ['Pending', 'Completed'], 
         default: 'Pending' 
    },

    calculatedAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('CodeCalculation', codeCalculationSchema);
