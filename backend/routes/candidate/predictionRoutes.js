const express = require("express");
const router = express.Router();
const predictionController = require("../../controllers/candidate/predictionController");

// Route to save prediction
router.post("/savePrediction", predictionController.savePrediction);

// Route to fetch prediction by email
router.get("/getPrediction/:email", predictionController.getPrediction);

module.exports = router;
