const CodeSubmissionModels = require('../../models/candidate/CodeSubmissionModels');  // Import SubmissionModels correctly
const Question = require('../../models/employer/Question');
const User = require('../../models/User');
const axios = require('axios');
const path = require('path');


// Create a new submission
exports.createSubmission = async (req, res) => {
    const { userId, questionId, code, language } = req.body;

    try {
        // Step 1: Save the code submission to the database
        const submission = new CodeSubmissionModels({
            userId,
            questionId,
            code,
            language,
        });

        // Save the submission
        await submission.save();

        // Step 2: Send the code to the microservice for evaluation
        const microServiceResponse = await axios.post('http://127.0.0.1:5001/evaluate', {
            code: code,
            language: language
        });

        // Step 3: The response from the microservice is assumed to be in `microServiceResponse.data`
        const evaluationResult = microServiceResponse.data;

        // Step 4: Save the evaluation result to the database (you can modify this part to suit your schema)
        submission.evaluationResult = evaluationResult;  // Add evaluation result to the submission model
        await submission.save();  // Save the updated submission

        // Step 5: Respond with success message, submission details, and evaluation result
        res.status(201).json({
            message: "Submission created and evaluated successfully",
            submission,  // You can include the saved submission with evaluation result
            evaluationResult // Sending back the result from the microservice
        });

    } catch (error) {
        console.error("Error in creating submission or evaluating code:", error);
        res.status(500).json({
            error: "Failed to create submission or evaluate code",
            details: error.message  // Add error details for better debugging
        });
    }
};



exports.getSubmissionById = async (req, res) => {
    const { id } = req.params; // Extract the submission ID from the request parameters

    try {
        // Fetch the submission by ID
        const submission = await CodeSubmissionModels.findById(id);

        // Check if the submission exists
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Send the found submission as a response
        res.status(200).json(submission);
    } catch (error) {
        console.error("Error fetching submission by ID:", error); // Log error details
        res.status(500).json({ error: "Failed to fetch submission", details: error.message });
    }
};


//get all

exports.getAllSubmissions = async (req, res) => {
    try {
        // Fetch all submissions without populating references
        const submissions = await CodeSubmissionModels.find();

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found" });
        }

        // Send the submissions as a response
        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error); // Log the full error object
        res.status(500).json({ error: "Failed to fetch submissions", details: error.message });
    }
};




// Update a submission
exports.updateSubmission = async (req, res) => {
    const { id } = req.params;
    const { code, language, status } = req.body;

    try {
        const submission = await CodeSubmissionModels.findByIdAndUpdate(  // Use SubmissionModels here
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
        const submission = await CodeSubmissionModels.findByIdAndDelete(id);  // Use SubmissionModels here
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }
        res.status(200).json({ message: "Submission deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete submission" });
    }
};
