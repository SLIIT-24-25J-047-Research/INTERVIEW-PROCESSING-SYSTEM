const express = require("express");
const router = express.Router();
const predictionController = require("../../controllers/candidate/predictionController");

// Route to save prediction
router.post("/savePrediction", predictionController.savePrediction);

// Route to fetch prediction by email
router.get("/getPrediction/:email", predictionController.getPrediction);

// Route to get all predictions by email and determine the most frequent prediction
router.get("/getAllPredictions/:email", predictionController.getAllPredictions);

module.exports = router;
