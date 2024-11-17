const express = require('express');
const router = express.Router();
const classificationController = require('../../controllers/candidate/classificationController');

// Route to store the prediction result
router.post('/store-prediction', async (req, res) => {
    const { email, prediction } = req.body;

    if (!email || !prediction) {
        return res.status(400).json({ error: 'Email and prediction are required' });
    }

    const result = await classificationController.storePrediction(email, prediction);

    if (result.success) {
        return res.status(200).json({ message: result.message });
    } else {
        return res.status(500).json({ error: result.message });
    }
});

module.exports = router;
