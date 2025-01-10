const express = require('express');
const router = express.Router();
const predictionController = require('../../controllers/candidate/SavedJobController');


router.post("/save", predictionController.saveJob);
router.get("/getSavedJobs/:userId", predictionController.getSavedJobs);
router.delete("/removeSavedJob/:userId/:jobId", predictionController.removeSavedJob);


module.exports = router;