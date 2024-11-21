const express = require('express');
const router = express.Router();
const CandidateScoreController = require('../../controllers/code_complexity/CandidateScoreController');

// CRUD endpoints
router.post('/', CandidateScoreController.createCandidateScore);
router.get('/:id', CandidateScoreController.getCandidateScore);
router.put('/:id', CandidateScoreController.updateCandidateScore);
router.delete('/:id', CandidateScoreController.deleteCandidateScore);

// List and sort candidate scores
router.get('/', CandidateScoreController.listCandidateScores);

module.exports = router;
