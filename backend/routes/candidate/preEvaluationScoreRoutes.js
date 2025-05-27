// routes/candidate/preEvaluationScoreRoutes.js
const express = require('express');
const router = express.Router();
const { savePreEvaluationScore } = require('../../controllers/candidate/preEvaluationScoreController');

// Route to save the pre-evaluation score
router.post('/savePreEvaluationScore', savePreEvaluationScore);

module.exports = router;