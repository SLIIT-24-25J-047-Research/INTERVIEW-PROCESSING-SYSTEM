const express = require('express');
const router = express.Router();
const stressController = require('../controllers/stressController');

router.post('/detect', stressController.detectStress);
router.get('/capture', stressController.captureAndDetect);

module.exports = router;
