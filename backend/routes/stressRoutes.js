const express = require('express');
const router = express.Router();
const multer = require('multer');
const stressController = require('../controllers/stressController');



const upload = multer({ dest: 'stressUploads/' });

router.post('/detect',  upload.single('file'), stressController.detectStress);
router.get('/user/:userId', stressController.getByUserId);
router.get('/question/:questionId', stressController.getByQuestionId);
router.get('/job/:jobId', stressController.getByJobId);
router.get('/interview/:interviewScheduleId', stressController.getByInterviewId);
router.get('/all', stressController.getAll);

module.exports = router;
