const CodeCalculation = require('../models/CodeCalculation');

// Create a new calculation record
exports.createCalculation = async (req, res) => {
    const { userId, questionId, code, cc, wcc, cfc, language } = req.body;

    try {
        const calculation = new CodeCalculation({
            userId,
            questionId,
            code,
            cc,
            wcc,
            cfc,
            language,
        });
        await calculation.save();
        res.status(201).json({ message: "Code calculation saved successfully", calculation });
    } catch (error) {
        res.status(500).json({ error: "Failed to save code calculation" });
    }
};

// Read (get) a specific calculation by ID
exports.getCalculation = async (req, res) => {
    const { id } = req.params;

    try {
        const calculation = await CodeCalculation.findById(id).populate('userId').populate('questionId');
        if (!calculation) {
            return res.status(404).json({ error: "Calculation not found" });
        }
        res.status(200).json(calculation);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch calculation" });
    }
};

// Update a calculation record
exports.updateCalculation = async (req, res) => {
    const { id } = req.params;
    const { code, cc, wcc, cfc, status } = req.body;

    try {
        const calculation = await CodeCalculation.findByIdAndUpdate(
            id,
            { code, cc, wcc, cfc, status },
            { new: true }
        );
        if (!calculation) {
            return res.status(404).json({ error: "Calculation not found" });
        }
        res.status(200).json({ message: "Calculation updated successfully", calculation });
    } catch (error) {
        res.status(500).json({ error: "Failed to update calculation" });
    }
};

// Delete a calculation record
exports.deleteCalculation = async (req, res) => {
    const { id } = req.params;

    try {
        const calculation = await CodeCalculation.findByIdAndDelete(id);
        if (!calculation) {
            return res.status(404).json({ error: "Calculation not found" });
        }
        res.status(200).json({ message: "Calculation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete calculation" });
    }
};

// List all calculations (optional: filtered by user or question)
exports.getAllCalculations = async (req, res) => {
    const { userId, questionId } = req.query;

    try {
        const filter = {};
        if (userId) filter.userId = userId;
        if (questionId) filter.questionId = questionId;

        const calculations = await CodeCalculation.find(filter).populate('userId').populate('questionId');
        res.status(200).json(calculations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch calculations" });
    }
};
