// routes/candidate/CVSkillsRoutes.js
const express = require('express');
const { saveExtractedSkills, getCVSkillsByUserId, getCVSkillsByJobId, getAllCVSkillsGroupedByJobId, deleteCVSkills } = require('../../controllers/candidate/CVSkillsController');
const router = express.Router();

// Route to save extracted skills
router.post('/save-skills', saveExtractedSkills);
router.get('/user/:userId', getCVSkillsByUserId); 
router.get('/job/:jobId', getCVSkillsByJobId); 
router.get('/grouped-by-job', getAllCVSkillsGroupedByJobId); 
router.delete('/:cvSkillsId', deleteCVSkills);


module.exports = router;