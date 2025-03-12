const express = require('express');
const router = express.Router();
const multer = require('multer');
const stressController = require('../controllers/stressController');



const upload = multer({ dest: 'stressUploads/' });

router.post('/detect',  upload.single('file'), stressController.detectStress);


module.exports = router;
