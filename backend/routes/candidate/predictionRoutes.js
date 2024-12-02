const express = require('express');
const router = express.Router();
const predictionController = require('../../controllers/candidate/predictionController');

router.post('/savePrediction', predictionController.savePrediction);

module.exports = router;
