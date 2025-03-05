const express = require('express');
const router = express.Router();
const CandidateScoreController = require('../../controllers/candidate/CodeComplexityScoreController');


router.post('/', CandidateScoreController.createCandidateScore);
router.get('/', CandidateScoreController.getCandidateScore);
router.put('/', CandidateScoreController.updateCandidateScore);
router.delete('/', CandidateScoreController.deleteCandidateScore);


router.get('/', CandidateScoreController.listCandidateScores);


module.exports = router;
