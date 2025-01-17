
const express = require('express');
const multer = require('multer');
const { uploadCV, getCV  } = require('../../controllers/candidate/CVController');
const path = require('path');
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
router.post('/upload', upload.single('cv'), uploadCV);
router.get('/download/:id', getCV);

module.exports = router;