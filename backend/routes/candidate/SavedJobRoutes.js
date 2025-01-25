const express = require('express');
const router = express.Router();
const savedJobController = require('../../controllers/candidate/SavedJobController');


router.post("/save", savedJobController.saveJob);
router.get("/getSavedJobs/:userId", savedJobController.getSavedJobs);
router.delete("/removeSavedJob/:userId/:jobId", savedJobController.removeSavedJob);


module.exports = router;