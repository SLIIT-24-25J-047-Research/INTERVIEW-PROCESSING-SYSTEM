const CodeSubmissionModels = require('../../models/candidate/CodeSubmissionModels');  // Import SubmissionModels correctly
const Question = require('../../models/employer/Question');
const User = require('../../models/User');
const axios = require('axios');
const path = require('path');


// Create 
exports.createSubmission = async (req, res) => {
    const { userId, questionId, code, language } = req.body;

    try {
      
        const submission = new CodeSubmissionModels({
            userId,
            questionId,
            code,
            language,
        });

        
        await submission.save();

        
        const microServiceResponse = await axios.post('http://127.0.0.1:5001/evaluate', {
            code: code,
            language: language
        });

       
        const evaluationResult = microServiceResponse.data;

    
        submission.evaluationResult = evaluationResult;  
        await submission.save();  

       
        res.status(201).json({
            message: "Submission created and evaluated successfully",
            submission, 
            evaluationResult 
        });

    } catch (error) {
        console.error("Error in creating submission or evaluating code:", error);
        res.status(500).json({
            error: "Failed to create submission or evaluate code",
            details: error.message  
        });
    }
};



exports.getSubmissionById = async (req, res) => {
    const { id } = req.params; 

    try {
        
        const submission = await CodeSubmissionModels.findById(id);

       
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

      
        res.status(200).json(submission);
    } catch (error) {
        console.error("Error fetching submission by ID:", error); 
        res.status(500).json({ error: "Failed to fetch submission", details: error.message });
    }
};


exports.getSubmissionsByQuestionId = async (req, res) => {
    const { questionId } = req.params;

    try {
        const submissions = await CodeSubmissionModels.find({ questionId });

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found for this question" });
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions by question ID:", error);
        res.status(500).json({ error: "Failed to fetch submissions", details: error.message });
    }
};



//get all

exports.getAllSubmissions = async (req, res) => {
    try {
  
        const submissions = await CodeSubmissionModels.find();

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found" });
        }

      
        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error); 
        res.status(500).json({ error: "Failed to fetch submissions", details: error.message });
    }
};




// Update 
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

// Delete 
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
