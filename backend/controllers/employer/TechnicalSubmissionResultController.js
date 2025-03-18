const Score  = require('../../models/employer/TechnicalSubmissionResult');

// Save or update scores
exports.saveScores = async (req, res) => {
    const { interviewScheduleId, jobId, userId, scores, totalScore, maxPossibleScore } = req.body;
  
    try {
      // Check if a score document already exists for this interview schedule
      let scoreDoc = await Score.findOne({ interviewScheduleId });
  
      if (scoreDoc) {
        // Update existing document
        scoreDoc.scores = scores;
        scoreDoc.totalScore = totalScore;
        scoreDoc.maxPossibleScore = maxPossibleScore;
      } else {
        // Create new document
        scoreDoc = new Score({
          interviewScheduleId,
          jobId,
          userId,
          scores,
          totalScore,
          maxPossibleScore
        });
      }
  
      await scoreDoc.save();
      res.status(200).json({ message: 'Scores saved successfully', scoreDoc });
    } catch (error) {
      res.status(500).json({ message: 'Error saving scores', error });
    }
  };
  
  // Get scores by interview schedule ID
  exports.getScores = async (req, res) => {
    const { interviewScheduleId } = req.params;
  
    try {
      const scoreDoc = await Score.findOne({ interviewScheduleId });
      if (!scoreDoc) {
        return res.status(404).json({ message: 'Scores not found' });
      }
      res.status(200).json(scoreDoc);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving scores', error });
    }
  };