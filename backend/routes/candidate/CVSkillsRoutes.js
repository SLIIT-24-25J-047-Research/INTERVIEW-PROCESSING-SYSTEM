// routes/candidate/CVSkillsRoutes.js
const express = require('express');
const { saveExtractedSkills } = require('../../controllers/candidate/CVSkillsController');
const router = express.Router();

// Route to save extracted skills
router.post('/save-skills', saveExtractedSkills);

module.exports = router;