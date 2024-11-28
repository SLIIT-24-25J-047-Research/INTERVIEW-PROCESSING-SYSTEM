const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg'); // Import fluent-ffmpeg
const Prediction = require('../models/candidate/Prediction');

exports.predictConfidence = async (req, res) => {
    try {
        console.log('Request body:', req.body); 
        console.log('Uploaded file:', req.file); 
        if (req.body.text) {
            const flaskResponse = await axios.post('http://127.0.0.1:3000/predict', {
                text: req.body.text
            });

            return res.status(200).json({
                success: true,
                message: flaskResponse.data.message,
                received_text: flaskResponse.data.received_text
            });
        }

       
        if (req.file) {
            const filePath = req.file.path; 
            const tempFilePath = path.join(__dirname, 'temp_audio.wav'); 
           
            ffmpeg(filePath)
                .toFormat('wav')
                .on('end', async () => {
                    console.log('Conversion completed');
                    const form = new FormData();
                    form.append('audio', fs.createReadStream(tempFilePath));

                    try {
                        // const flaskResponse = await axios.post('http://voice-confidence:3000/predict', form, {
                        //     headers: {
                        //         ...form.getHeaders()
                        //     }
                        // });
                        const flaskResponse = await axios.post('http://127.0.0.1:3000/predict', form, {
                            headers: {
                                ...form.getHeaders()
                            }
                        });

                        // http://127.0.0.1:3000

                        console.log('Flask response:', flaskResponse.data); // Log Flask response

                        // Save prediction in the database
                        const newPrediction = new Prediction({
                            email: req.body.email,
                            prediction: flaskResponse.data.prediction
                        });
                        await newPrediction.save();

                        // Clean up the temporary converted audio file
                        fs.unlink(tempFilePath, (err) => {
                            if (err) {
                                console.error(`Error deleting converted file: ${err}`);
                            } else {
                                console.log(`Successfully deleted file: ${tempFilePath}`);
                            }
                        });

                        return res.status(200).json({
                            success: true,
                            prediction: flaskResponse.data.prediction
                        });
                    } catch (error) {
                        console.error('Error in Flask response:', error.message);
                        res.status(500).json({
                            success: false,
                            message: 'Error in processing prediction'
                        });
                    }
                })
                .on('error', (err) => {
                    console.error('Error in conversion:', err.message);
                    res.status(500).json({
                        success: false,
                        message: 'Error in converting audio file'
                    });
                })
                .save(tempFilePath); 
        } else {
            return res.status(400).json({
                success: false,
                message: 'No audio file or text provided'
            });
        }
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Error in processing prediction'
        });
    }
};