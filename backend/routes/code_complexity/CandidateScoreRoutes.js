const express = require('express');
const router = express.Router();
const candidateScoreController = require('../controllers/candidateScoreController');

// CRUD endpoints
router.post('/', candidateScoreController.createCandidateScore);
router.get('/:id', candidateScoreController.getCandidateScore);
router.put('/:id', candidateScoreController.updateCandidateScore);
router.delete('/:id', candidateScoreController.deleteCandidateScore);

// List and sort candidate scores
router.get('/', candidateScoreController.listCandidateScores);

module.exports = router;
