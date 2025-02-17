const FormData = require('form-data'); 
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const path = require('path');
const Question = require('../models/employer/Question'); 


exports.processAudio = async (req, res) => {
    try {

        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        // Check if audio file is provided
        if (!req.file) {
            console.error('No audio file provided.');
            return res.status(400).json({
                success: false,
                message: 'Audio file not provided',
            });
        }

        console.log('Audio file received:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
        });

        // Check if questionId is provided
        if (!req.body.questionId) {
            console.error('No question ID provided.');
            return res.status(400).json({
                success: false,
                message: 'Question ID not provided',
            });
        }

        const questionId = req.body.questionId;

        // Fetch the question to get the actual answer
        const question = await Question.findById(questionId);

        if (!question) {
            console.error(`Question not found for ID: ${questionId}`);
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }

        console.log('Question retrieved successfully:', question);

       
        const filePath = req.file.path; 
        const tempFilePath = path.join(__dirname, 'temp_audio.wav');

       
        ffmpeg(filePath)
            .toFormat('wav') 
            .on('start', (commandLine) => {
                console.log('FFmpeg command:', commandLine); 
            })
            .on('progress', (progress) => {
                console.log('Conversion progress:', progress); 
            })
            .on('end', async () => {
                console.log('Audio conversion completed.');

               
                const form = new FormData();
                form.append('audio', fs.createReadStream(tempFilePath)); 

                console.log('FormData prepared for microservice.');

                try {
                    //  transcription
                    // const response = await axios.post('http://voice-confidence:3000/transcribe', form, {
                    //     headers: {
                    //         ...form.getHeaders(),
                    //     },
                    // });
                    const response = await axios.post('http://127.0.0.1:3000/transcribe', form, {
                        headers: {
                            ...form.getHeaders(),
                        },
                    });

                   
                    const transcription = response.data.candidate_answer;

                    console.log('Transcription result:', transcription);

                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error('Error deleting converted file:', err.message);
                        } else {
                            console.log('Converted file deleted.');
                        }
                    });

                   
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting uploaded file:', err.message);
                        } else {
                            console.log('Uploaded file deleted.');
                        }
                    });

                     // compare the transcribed answer with the actual answers
                     const actualAnswers = question.answers; 
                    //  const comparisonResponse = await axios.post('http://voice-confidence:3000/compare', {
                    //      candidate_answer: transcription,
                    //      actual_answer: question.answers, 
                    //  }); 

                     const comparisonResponse = await axios.post('http://127.0.0.1:3000/compare', {
                        candidate_answer: transcription,
                        actual_answer: question.answers, 
                    });
                    console.log('candidate_answer:', transcription);
                    console.log('actual_answer:', actualAnswers);
 
                   
                     const { similarity_scores, is_correct } = comparisonResponse.data;
 
                     console.log('Similarity Scores:', similarity_scores);
                     console.log('Is the answer correct?', is_correct);


                    return res.status(200).json({
                        success: true,
                        transcription: transcription,
                        similarity: similarity_scores,
                        isCorrect: is_correct,
                    });
                } catch (error) {
                    console.error('Error in Flask response:', error.message);
                    return res.status(500).json({
                        success: false,
                        message: 'Error in processing transcription',
                    });
                }
            })
            .on('error', (err) => {
                console.error('Error during conversion:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Error in converting audio file',
                    error: err.message, 
                });
            })
            .save(tempFilePath); 
    } catch (error) {
        console.error('Unexpected error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            error: error.message,
        });
    }
};