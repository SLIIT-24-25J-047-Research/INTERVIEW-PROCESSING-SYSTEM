const express = require('express');
const router = express.Router();
const CodeCalculationController = require('../../controllers/candidate/CodeCalculationController');


router.post('/', CodeCalculationController.createCalculation);
router.get('/calculations/:id', CodeCalculationController.getCalculation);
router.put('/calculations/:id', CodeCalculationController.updateCalculation);
router.delete('/calculations/:id', CodeCalculationController.deleteCalculation);
router.get('/calculations', CodeCalculationController.getAllCalculations);

module.exports = router;
