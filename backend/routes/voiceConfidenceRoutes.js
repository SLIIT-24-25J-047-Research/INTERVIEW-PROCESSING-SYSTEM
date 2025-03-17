const express = require('express');
const multer = require('multer');
const path = require('path');
const { unifiedAudioController } = require('../controllers/confidencePredictController');


const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

router.post('/predict', upload.single('audio'), unifiedAudioController);


module.exports = router;
