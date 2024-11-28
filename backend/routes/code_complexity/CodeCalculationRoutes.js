const express = require('express');
const router = express.Router();
const CodeCalculationController = require('../../controllers/code_complexity/CodeCalculationController');

// Create a new Code Calculation
router.post('/', CodeCalculationController.createCalculation);

// Get a specific Code Calculation by ID
router.get('/calculations/:id', CodeCalculationController.getCalculation);

// Update a Code Calculation by ID
router.put('/calculations/:id', CodeCalculationController.updateCalculation);

// Delete a Code Calculation by ID
router.delete('/calculations/:id', CodeCalculationController.deleteCalculation);

// Get all Code Calculations (Optional)
router.get('/calculations', CodeCalculationController.getAllCalculations);

module.exports = router;
