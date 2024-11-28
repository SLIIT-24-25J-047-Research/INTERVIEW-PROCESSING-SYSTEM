const express = require('express');
const router = express.Router();
const CandidateScoreController = require('../../controllers/code_complexity/CandidateScoreController');

// CRUD endpoints
router.post('/', CandidateScoreController.createCandidateScore);
router.get('/', CandidateScoreController.getCandidateScore);
router.put('/', CandidateScoreController.updateCandidateScore);
router.delete('/', CandidateScoreController.deleteCandidateScore);

// List and sort candidate scores
router.get('/', CandidateScoreController.listCandidateScores);

// Export the router
module.exports = router;
