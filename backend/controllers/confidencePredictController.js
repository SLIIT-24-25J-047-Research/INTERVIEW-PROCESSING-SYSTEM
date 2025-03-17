const FormData = require('form-data');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const path = require('path');
const Question = require('../models/employer/Question');
const AudioResponse = require('../models/AudioResponseModel'); // Import the model


//  base URL
const MICROSERVICE_URL = 'http://127.0.0.1:3000';


exports.unifiedAudioController = async (req, res) => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

       
        if (!req.file) {
            console.error('No audio file provided.');
            return res.status(400).json({
                success: false,
                message: 'Audio file not provided',
            });
        }

 
        const { questionId, interviewId } = req.body;
        if (!questionId || !interviewId) {
            console.error('Question ID or Interview ID not provided.');
            cleanupFiles(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Question ID or Interview ID not provided',
            });
        }

        // Get the question first before starting any processing
        const question = await Question.findById(questionId);
        if (!question) {
            console.error(`Question not found for ID: ${questionId}`);
            cleanupFiles(req.file.path);
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }
        console.log('Question retrieved successfully:', question);

        // Create a copy of the file for each operation to avoid conflicts
        const originalPath = req.file.path;
        const predictionPath = path.join(path.dirname(originalPath), `pred_${path.basename(originalPath)}`);
        const transcriptionPath = path.join(path.dirname(originalPath), `trans_${path.basename(originalPath)}`);
        
        // Copy the file for prediction
        fs.copyFileSync(originalPath, predictionPath);
        // Copy the file for transcription
        fs.copyFileSync(originalPath, transcriptionPath);
        
        // 1.  process prediction
        let confidencePrediction = null;
        try {
            confidencePrediction = await processPrediction(predictionPath);
            console.log('Confidence prediction completed:', confidencePrediction);
        } catch (error) {
            console.error('Error in confidence prediction:', error.message);
           
        }

        // 2.  process transcription
        let transcriptionResult = null;
        try {
            const transcription = await transcribeAudio(transcriptionPath);
            console.log('Transcription result:', transcription);
            
            // Then process comparison
            const comparisonResult = await compareAnswers(transcription, question.answers);
            console.log('Comparison results:', comparisonResult);
            
            transcriptionResult = {
                transcription: transcription,
                similarity: comparisonResult.similarity_scores,
                isCorrect: comparisonResult.is_correct
            };
        } catch (error) {
            console.error('Error in transcription or comparison:', error.message);
        }

        // Clean up all files
        cleanupFiles(originalPath);
        cleanupFiles(predictionPath);
        cleanupFiles(transcriptionPath);

        
         const questionResponse = {
            questionId: questionId,
            prediction: confidencePrediction || null,
            transcription: transcriptionResult ? transcriptionResult.transcription : null,
            similarityScores: transcriptionResult ? transcriptionResult.similarity : null,
            isCorrect: transcriptionResult ? transcriptionResult.isCorrect : null
        };

        // Save to  database
        const audioResponse = await AudioResponse.findOneAndUpdate(
            { interviewId: interviewId }, // Query
            { $push: { responses: questionResponse } }, // Update
            { upsert: true, new: true } // Options: Create if not found, return updated document
        );
        console.log('Audio response saved/updated in database:', audioResponse);



        return res.status(200).json({
            success: true,
            prediction: confidencePrediction || { message: "Prediction failed" },
            ...(transcriptionResult && {
                transcription: transcriptionResult.transcription,
                similarity: transcriptionResult.similarity,
                isCorrect: transcriptionResult.isCorrect
            })
        });
    } catch (error) {
        console.error('Unexpected error:', error.message);
        if (req.file) cleanupFiles(req.file.path);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            error: error.message,
        });
    }
};

/**
 * Process confidence prediction from audio
 */
async function processPrediction(filePath) {
    const tempFilePath = path.join(__dirname, `temp_pred_${Date.now()}.wav`);
    
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .toFormat('wav')
            .on('end', async () => {
                console.log('Conversion for prediction completed');
                
                try {
                    const form = new FormData();
                    form.append('audio', fs.createReadStream(tempFilePath));
                    
                    console.log('Sending audio for prediction');
                    const response = await axios.post(`${MICROSERVICE_URL}/predict`, form, {
                        headers: {
                            ...form.getHeaders()
                        }
                    });
                    
                    console.log('Prediction response received');
                    
                    // Clean up temp file
                    cleanupFiles(tempFilePath);
                    
                    resolve(response.data);
                } catch (error) {
                    console.error('Error in prediction processing:', error.message);
                    cleanupFiles(tempFilePath);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error in conversion for prediction:', err.message);
                cleanupFiles(tempFilePath);
                reject(err);
            })
            .save(tempFilePath);
    });
}

/**
 * Transcribe audio file
 */
async function transcribeAudio(filePath) {
    const tempFilePath = path.join(__dirname, `temp_trans_${Date.now()}.wav`);
    
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .toFormat('wav')
            .on('end', async () => {
                console.log('Conversion for transcription completed');
                
                try {
                    const form = new FormData();
                    form.append('audio', fs.createReadStream(tempFilePath));
                    
                    console.log('Sending audio for transcription');
                    const response = await axios.post(`${MICROSERVICE_URL}/transcribe`, form, {
                        headers: {
                            ...form.getHeaders()
                        }
                    });
                    
                    console.log('Transcription response received');
                    cleanupFiles(tempFilePath);
                    
                    resolve(response.data.candidate_answer);
                } catch (error) {
                    console.error('Error in transcription:', error.message);
                    cleanupFiles(tempFilePath);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error in conversion for transcription:', err.message);
                cleanupFiles(tempFilePath);
                reject(err);
            })
            .save(tempFilePath);
    });
}

/**
 * Compare answers with question
 */
async function compareAnswers(candidateAnswer, actualAnswers) {
    console.log('Sending answers for comparison');
    console.log('candidate_answer:', candidateAnswer);
    console.log('actual_answer:', actualAnswers);
    
    const response = await axios.post(`${MICROSERVICE_URL}/compare`, {
        candidate_answer: candidateAnswer,
        actual_answer: actualAnswers,
    });
    
    console.log('Comparison response received');
    
    return {
        similarity_scores: response.data.similarity_scores,
        is_correct: response.data.is_correct
    };
}

/**
 * Helper function to clean up files
 */
function cleanupFiles(filePath) {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${filePath}:`, err);
            } else {
                console.log(`Successfully deleted file: ${filePath}`);
            }
        });
    }
}


exports.getByInterviewId = async (req, res) => {
    try {
        const { interviewId } = req.params;

        if (!interviewId) {
            return res.status(400).json({
                success: false,
                message: 'Interview ID is required',
            });
        }

       
        const audioResponse = await AudioResponse.findOne({ interviewId }).populate('responses.questionId', 'text'); // Populate question text if needed

        if (!audioResponse) {
            return res.status(404).json({
                success: false,
                message: 'No responses found for this interview',
            });
        }

        return res.status(200).json({
            success: true,
            data: audioResponse,
        });
    } catch (error) {
        console.error('Error fetching responses by interview ID:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching responses',
            error: error.message,
        });
    }
};


exports.getByQuestionId = async (req, res) => {
    try {
        const { questionId } = req.params;

        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: 'Question ID is required',
            });
        }

        // Find the document that contains the question response
        const audioResponse = await AudioResponse.findOne(
            { 'responses.questionId': questionId },
            { 'responses.$': 1 } // Project only the matching response
        ).populate('responses.questionId', 'text'); // Populate question text if needed

        if (!audioResponse || !audioResponse.responses || audioResponse.responses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No response found for this question',
            });
        }

        // Extract the specific question response
        const questionResponse = audioResponse.responses[0];

        return res.status(200).json({
            success: true,
            data: questionResponse,
        });
    } catch (error) {
        console.error('Error fetching response by question ID:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the response',
            error: error.message,
        });
    }
};