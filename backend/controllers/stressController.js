// controller.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const StressDetection = require('../models/StressDetection'); // Import the model


exports.detectStress = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

      
        const { questionID, jobID, interviewScheduleID, userID } = req.body;

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.filename,
            contentType: req.file.mimetype
        });

        console.log('🚀 FormData JSON being sent:', {
            file: req.file.filename,
            questionID,
            jobID,
            interviewScheduleID,
            userID
        });

        
        const response = await axios.post('http://127.0.0.1:3001/predict', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

     
        fs.unlinkSync(req.file.path);

        console.log('✅ Response from Python service:', response.data);

        const { emotion, prediction_values, stress_level } = response.data;

      
        let interview = await StressDetection.findOne({
            userId: userID,
            interviewScheduleId: interviewScheduleID,
            jobId: jobID
        });

        if (!interview) {
            interview = new StressDetection({
                userId: userID,
                interviewScheduleId: interviewScheduleID,
                jobId: jobID,
                questions: []
            });
        }

        
        const existingQuestionIndex = interview.questions.findIndex(q => q.questionId.toString() === questionID);

        if (existingQuestionIndex !== -1) {
      
            interview.questions[existingQuestionIndex] = {
                questionId: questionID,
                emotion,
                predictionValues: prediction_values,
                stressLevel: stress_level
            };
        } else {
            // Add new question entry
            interview.questions.push({
                questionId: questionID,
                emotion,
                predictionValues: prediction_values,
                stressLevel: stress_level
            });
        }

     
        await interview.save();
        console.log('✅ Updated interview record:', interview);

        res.json({
            message: 'Stress detection result saved successfully',
            data: interview
        });

    } catch (error) {
        console.error('❌ Error processing request:', error.message, error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const records = await StressDetection.find({ userId })
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('❌ Error fetching by userId:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getByQuestionId = async (req, res) => {
    try {
        const { questionId } = req.params;

        // Find records containing the given questionId
        const records = await StressDetection.find({ 'questions.questionId': questionId });

        // Extract required fields for the given questionId
        const questionData = records.flatMap(record =>
            record.questions
                .filter(q => q.questionId.toString() === questionId)
                .map(q => ({
                    emotion: q.emotion,
                    predictionValues: q.predictionValues,
                    stressLevel: q.stressLevel
                }))
        );

        res.json({ success: true, data: questionData });
    } catch (error) {
        console.error('❌ Error fetching data by questionId:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Get stress  by job ID
exports.getByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;
        const records = await StressDetection.find({ jobId })
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('❌ Error fetching by jobId:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get stress  by interview ID
exports.getByInterviewId = async (req, res) => {
    try {
        const { interviewScheduleId } = req.params;
        const records = await StressDetection.find({ interviewScheduleId })
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('❌ Error fetching by interviewScheduleId:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all 
exports.getAll = async (req, res) => {
    try {
        const records = await StressDetection.find()
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('❌ Error fetching all records:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};