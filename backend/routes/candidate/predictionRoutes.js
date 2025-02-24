const express = require("express");
const router = express.Router();
const predictionController = require("../../controllers/candidate/predictionController");


router.post("/savePrediction", predictionController.savePrediction);
router.get("/getPrediction/:email", predictionController.getPrediction);
router.get("/getAllPredictions/:email", predictionController.getAllPredictions);

module.exports = router;
