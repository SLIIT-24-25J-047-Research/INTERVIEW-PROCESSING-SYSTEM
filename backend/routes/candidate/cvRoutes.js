const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadCV, getAllCVs, deleteCV } = require('../../controllers/candidate/cvController');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('cvFile'), uploadCV);
router.get('/all', getAllCVs);
router.delete('/:id', deleteCV);

module.exports = router;
