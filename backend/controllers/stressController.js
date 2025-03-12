// controller.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

exports.detectStress = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.filename,
            contentType: req.file.mimetype
        });

        const response = await axios.post('http://127.0.0.1:3001/predict', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Delete the uploaded file after sending
        fs.unlinkSync(req.file.path);

        res.json(response.data);
    } catch (error) {
        console.error('Error sending image to microservice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
