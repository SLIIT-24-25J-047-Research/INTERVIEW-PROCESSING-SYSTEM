const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Function to predict voice confidence
// exports.predictConfidence = async (req, res) => {
//     try {
//         // Check for text input
//         if (req.body.text) {
//             const flaskResponse = await axios.post('http://127.0.0.1:3000/predict', {
//                 text: req.body.text
//             });

//             return res.status(200).json({
//                 success: true,
//                 message: flaskResponse.data.message,
//                 received_text: flaskResponse.data.received_text
//             });
//         }

//         // Check for audio file input
//         if (req.file) {
//             const filePath = req.file.path; // Path to the uploaded audio file
//             const form = new FormData();
//             form.append('audio', fs.createReadStream(filePath));

//             const flaskResponse = await axios.post('http://127.0.0.1:3000/predict', form, {
//                 headers: {
//                     ...form.getHeaders()
//                 }
//             });

//             // Clean up the audio file after processing
//             fs.unlink(filePath, (err) => {
//                 if (err) console.error(`Error deleting file: ${err}`);
//             });

//             return res.status(200).json({
//                 success: true,
//                 prediction: flaskResponse.data
//             });
//         }

//         return res.status(400).json({
//             success: false,
//             message: 'No audio file or text provided'
//         });

//     } catch (error) {
//         console.error('Error details:', error.response ? error.response.data : error.message);
//         res.status(500).json({
//             success: false,
//             message: 'Error in processing prediction'
//         });
//     }
// };


exports.predictConfidence = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the full request body
        console.log('Uploaded file:', req.file); // Log the uploaded file

        // Check for text input
        if (req.body.text) {
            const flaskResponse = await axios.post('http://voice-confidence:3000/predict', {
                text: req.body.text
            });

            return res.status(200).json({
                success: true,
                message: flaskResponse.data.message,
                received_text: flaskResponse.data.received_text
            });
        }

        // Check for audio file input
        if (req.file) {
            const filePath = req.file.path; // Path to the uploaded audio file
            const form = new FormData();
            form.append('audio', fs.createReadStream(filePath));

            const flaskResponse = await axios.post('http://voice-confidence:3000/predict', form, {
                headers: {
                    ...form.getHeaders()
                }
            });

            console.log('Flask response:', flaskResponse.data); // Log Flask response

            // Clean up the audio file after processing
            // fs.unlink(filePath, (err) => {
            //     if (err) {
            //         console.error(`Error deleting file: ${err}`);
            //     } else {
            //         console.log(`Successfully deleted file: ${filePath}`);
            //     }
            // });

            return res.status(200).json({
                success: true,
                prediction: flaskResponse.data
            });
        }

        return res.status(400).json({
            success: false,
            message: 'No audio file or text provided'
        });

    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Error in processing prediction'
        });
    }
};