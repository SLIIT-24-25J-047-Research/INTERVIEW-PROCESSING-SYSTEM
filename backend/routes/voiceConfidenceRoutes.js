const express = require('express');
const multer = require('multer');
const { predictConfidence } = require('../controllers/predictController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // Set up multer for file uploads

// Route to handle confidence prediction
router.post('/predict', upload.single('file'), predictConfidence);

module.exports = router;
