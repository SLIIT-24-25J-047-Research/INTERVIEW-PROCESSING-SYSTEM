const mongoose = require('mongoose');

const CandidateCVSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    cvFilePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CandidateCV', CandidateCVSchema);
