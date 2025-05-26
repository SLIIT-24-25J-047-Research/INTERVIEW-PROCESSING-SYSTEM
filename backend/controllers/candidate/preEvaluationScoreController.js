// controllers/preEvaluationScoreController.js
const PreEvaluationScore = require('../../models/candidate/PreEvaluationScore');

const savePreEvaluationScore = async (req, res) => {
    try {
      const { email, professionalism, mockupTestScore, totalPreEvaluationScore, status } = req.body;
  
      let preEvaluationScore = await PreEvaluationScore.findOne({ email });
  
      if (preEvaluationScore) {
        // If the record exists, update it
        preEvaluationScore.professionalism = professionalism;
        preEvaluationScore.mockupTestScore = mockupTestScore;
        preEvaluationScore.totalPreEvaluationScore = totalPreEvaluationScore;
        preEvaluationScore.status = status;
        await preEvaluationScore.save();
        return res.status(200).json({ message: "Pre-evaluation score updated successfully." });
      }
  
      // Otherwise, create a new record
      preEvaluationScore = new PreEvaluationScore({
        email,
        professionalism,
        mockupTestScore,
        totalPreEvaluationScore,
        status,
      });
  
      await preEvaluationScore.save();
      return res.status(201).json({ message: "Pre-evaluation score saved successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error saving pre-evaluation score." });
    }
  };
  
  module.exports = { savePreEvaluationScore };