const mongoose = require('mongoose');

// Define the schema for image classification results
const imageClassificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    prediction: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ImageClassification = mongoose.model('ImageClassification', imageClassificationSchema);

module.exports = ImageClassification;
