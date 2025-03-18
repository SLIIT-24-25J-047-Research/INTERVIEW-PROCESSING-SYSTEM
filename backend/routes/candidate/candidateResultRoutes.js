// backend/routes/candidateResultRoutes.js
const express = require('express');
const router = express.Router();
const { saveTestResult, getTestResultByEmail } = require('../../controllers/candidate/candidateResultController');

// Route to save the test result
router.post('/save', saveTestResult);

// Route to get the test result by email
router.get('/getResultByEmail/:email', getTestResultByEmail);

module.exports = router;

