const express = require('express');
const multer = require('multer');
const path = require('path');
const { predictConfidence } = require('../controllers/predictController');

const router = express.Router();
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Specify the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file
    }
});

const upload = multer({ storage: storage });

// Define the route for audio and text prediction
router.post('/predict', upload.single('audio'), predictConfidence);


module.exports = router;
