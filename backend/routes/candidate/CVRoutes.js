
const express = require('express');
const multer = require('multer');
const { uploadCV, getCV,updateCV, deleteCV, getCVMetrics ,getCVByUserId } = require('../../controllers/candidate/CVController');
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
router.get('/metrics/:cvId', getCVMetrics);
router.delete('/delete/:cvId', deleteCV);
router.put('/update/:cvId', upload.single('cv'), updateCV);
router.get('/user/:userId', getCVByUserId);


module.exports = router;