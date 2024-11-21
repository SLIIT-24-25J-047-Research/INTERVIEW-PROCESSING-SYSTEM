// Description: Handles all the business logic of code complexity submission module.
const SubmissionModels = require('../../models/code_complexity/SubmissionModels');  // Import SubmissionModels correctly
const Question = require('../../models/employer/Question');
const User = require('../../models/User');
const axios = require('axios');
const path = require('path');

// Create a new submission
exports.createSubmission = async (req, res) => {
    const { userId, questionId, code, language } = req.body;

    try {
        const submission = new SubmissionModels({  // Use SubmissionModels here
            userId,
            questionId,
            code,
            language,
        });
        await submission.save();
        res.status(201).json({ message: "Submission created successfully", submission });
    } catch (error) {
        res.status(500).json({ error: "Failed to create submission" });
    }
};

// Read a specific submission
exports.getSubmission = async (req, res) => {
    const { id } = req.params;

    try {
        const submission = await SubmissionModels.findById(id).populate('userId').populate('questionId');  // Use SubmissionModels here
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch submission" });
    }
};

// Update a submission
exports.updateSubmission = async (req, res) => {
    const { id } = req.params;
    const { code, language, status } = req.body;

    try {
        const submission = await SubmissionModels.findByIdAndUpdate(  // Use SubmissionModels here
            id,
            { code, language, status },
            { new: true }
        );
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }
        res.status(200).json({ message: "Submission updated successfully", submission });
    } catch (error) {
        res.status(500).json({ error: "Failed to update submission" });
    }
};

// Delete a submission  
exports.deleteSubmission = async (req, res) => {
    const { id } = req.params;

    try {
        const submission = await SubmissionModels.findByIdAndDelete(id);  // Use SubmissionModels here
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }
        res.status(200).json({ message: "Submission deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete submission" });
    }
};

// List all submissions (optional: filtered by user or question)
exports.getAllSubmissions = async (req, res) => {
    const { userId, questionId } = req.query;

    try {
        const filter = {};
        if (userId) filter.userId = userId;
        if (questionId) filter.questionId = questionId;

        const submissions = await SubmissionModels.find(filter).populate('userId').populate('questionId');  // Use SubmissionModels here
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
};
