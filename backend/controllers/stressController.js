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
            // Update existing question
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
