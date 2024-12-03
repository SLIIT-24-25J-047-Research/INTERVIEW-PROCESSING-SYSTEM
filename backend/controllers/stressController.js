const NodeWebcam = require('node-webcam');
const axios = require('axios');
const fs = require('fs');

// Camera options
const opts = {
    width: 1280,
    height: 720,
    quality: 100,
    saveShots: true,
    output: "jpeg",
    callbackReturn: "location",
    verbose: false
};

exports.captureAndDetect = async (req, res) => {
    const Webcam = NodeWebcam.create(opts);

    // Capture the image
    Webcam.capture("captured_image", async (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to capture image." });
        }

        try {
            // Send the image to Flask API
            const response = await axios.post(
                "http://127.0.0.1:3000/detect-stress",
                {
                    image: fs.createReadStream(data),
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Send the stress level prediction back to the frontend
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: "Failed to predict stress.", details: error.message });
        }
    });
};

exports.detectStress = async (req, res) => {
    try {
        const imageFile = req.file; // Assuming you handle file upload middleware
        const response = await axios.post('http://127.0.0.1:3000/detect-stress', {
            image: imageFile.buffer
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Stress detection failed', details: error.message });
    }
};


