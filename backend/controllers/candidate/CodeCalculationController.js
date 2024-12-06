const CodeCalculation = require('../../models/candidate/CodeCalculationModels');

// Create a new Code Calculation
exports.createCalculation = async (req, res) => {
  try {
    const { userId, questionId, code, cc, wcc, cfc, language } = req.body;

    // Create the new calculation document
    const newCalculation = new CodeCalculation({
      userId,
      questionId,
      code,
      cc,
      wcc,
      cfc,
      language,
    });

    // Save the document to the database
    const savedCalculation = await newCalculation.save();

    res.status(201).json(savedCalculation);
  } catch (err) {
    res.status(500).json({ message: 'Error creating calculation', error: err.message });
  }
};

// Get a specific Code Calculation by ID
exports.getCalculation = async (req, res) => {
  try {
    const calculation = await CodeCalculation.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.status(200).json(calculation);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving calculation', error: err.message });
  }
};

// Update a Code Calculation by ID
exports.updateCalculation = async (req, res) => {
  try {
    const updatedCalculation = await CodeCalculation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCalculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.status(200).json(updatedCalculation);
  } catch (err) {
    res.status(500).json({ message: 'Error updating calculation', error: err.message });
  }
};

// Delete a Code Calculation by ID
exports.deleteCalculation = async (req, res) => {
  try {
    const deletedCalculation = await CodeCalculation.findByIdAndDelete(req.params.id);

    if (!deletedCalculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.status(200).json({ message: 'Calculation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting calculation', error: err.message });
  }
};

// Get all calculations (Optional: Can add filtering here)
exports.getAllCalculations = async (req, res) => {
  try {
    const calculations = await CodeCalculation.find();

    if (calculations.length === 0) {
      return res.status(404).json({ message: 'No calculations found' });
    }

    res.status(200).json(calculations);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving calculations', error: err.message });
  }
};
