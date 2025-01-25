const express = require('express');
const skillGroupController = require('../../controllers/employer/skillGroupController');

const router = express.Router();


router.post('/', skillGroupController.createSkillGroup);
router.get('/', skillGroupController.getAllSkillGroups);

router.get('/skills', skillGroupController.getSkillGroupsBySkills);  
router.get('/:id', skillGroupController.getSkillGroupById);
router.put('/:id', skillGroupController.updateSkillGroup);
router.delete('/:id', skillGroupController.deleteSkillGroup);
router.get('/focus/:focus', skillGroupController.getSkillGroupsByFocus);  // Get by focus


module.exports = router;
