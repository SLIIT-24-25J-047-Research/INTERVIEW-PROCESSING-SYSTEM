const Score  = require('../../models/employer/TechnicalSubmissionResult');

// Save 
exports.saveScores = async (req, res) => {
    const { interviewScheduleId, jobId, userId, scores, totalScore, maxPossibleScore } = req.body;
  
    try {
    
      let scoreDoc = await Score.findOne({ interviewScheduleId });
  
      if (scoreDoc) {
     
        scoreDoc.scores = scores;
        scoreDoc.totalScore = totalScore;
        scoreDoc.maxPossibleScore = maxPossibleScore;
      } else {
       
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
  
  // Get  by interview schedule ID
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