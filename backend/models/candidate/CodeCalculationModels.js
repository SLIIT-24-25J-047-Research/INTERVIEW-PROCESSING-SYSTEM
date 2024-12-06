const mongoose = require('mongoose');

// Define the schema for the CodeCalculation
const codeCalculationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming 'User' model exists
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question', // Assuming 'Question' model exists
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    cc: {
      type: Number,
      required: true,
    }, // Cyclomatic Complexity
    wcc: {
      type: Number,
      required: true,
    }, // Weighted Composite Complexity
    cfc: {
      type: Number,
      required: true,
    }, // Cognitive Functional Size
    language: {
      type: String,
      default: 'JavaScript', // Optional field, default is JavaScript
    }, // The programming language for the code
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending', // Default status is Pending
    },
    calculatedAt: {
      type: Date,
      default: Date.now, // Sets the time when the record was created
    },
  },
  {
    timestamps: true, // Automatically manage 'createdAt' and 'updatedAt' timestamps
  }
);

// Create and export the model based on the schema
module.exports = mongoose.model('CodeCalculation', codeCalculationSchema);
