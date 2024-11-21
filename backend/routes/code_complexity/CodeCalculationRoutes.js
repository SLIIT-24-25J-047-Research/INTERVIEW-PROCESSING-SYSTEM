const express = require('express');
const router = express.Router();
const codeCalculationController = require('../controllers/codeCalculationController');

// CRUD endpoints
router.post('/', codeCalculationController.createCalculation);
router.get('/:id', codeCalculationController.getCalculation);
router.put('/:id', codeCalculationController.updateCalculation);
router.delete('/:id', codeCalculationController.deleteCalculation);

// Optional: List all calculations
router.get('/', codeCalculationController.getAllCalculations);

module.exports = router;
