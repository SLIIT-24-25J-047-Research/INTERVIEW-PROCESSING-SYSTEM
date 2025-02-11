const express = require('express');
const router = express.Router();
const { executeCode } = require('../../controllers/employer/TechnicalCodeExecutionController');

router.post('/execute', executeCode);

module.exports = router;