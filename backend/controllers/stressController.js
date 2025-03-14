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

        // Extracting required fields from request body
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

        // Send image to Python service
        const response = await axios.post('http://127.0.0.1:3001/predict', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Delete the uploaded file after sending
        fs.unlinkSync(req.file.path);

        console.log('✅ Response from Python service:', response.data);

        // Extract response data
        const { emotion, prediction_values, stress_level } = response.data;

        // Save to MongoDB
        const stressRecord = new StressDetection({
            userId: userID, // Matching field names with schema
            interviewScheduleId: interviewScheduleID,
            jobId: jobID,
            questionId: questionID,
            emotion,
            predictionValues: prediction_values,
            stressLevel: stress_level
        });

        await stressRecord.save();
        console.log('✅ Data saved to MongoDB:', stressRecord);

        // Send success response
        res.json({
            message: 'Stress detection result saved successfully',
            data: stressRecord
        });

    } catch (error) {
        console.error('❌ Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};