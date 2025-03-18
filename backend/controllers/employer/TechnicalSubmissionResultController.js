const SubmissionResult = require('../../models/employer/TechnicalSubmissionResult');

exports.saveSubmissionResult = async (req, res) => {
  try {
    const { submissionId, userId, interviewScheduleId, jobId, questions, totalScore, maxPossibleScore } = req.body;

    const submissionResult = new SubmissionResult({
      submissionId,
      userId,
      interviewScheduleId,
      jobId,
      questions,
      totalScore,
      maxPossibleScore
    });

    await submissionResult.save();
    res.status(201).json({ message: 'Submission result saved successfully', submissionResult });
  } catch (error) {
    res.status(500).json({ message: 'Error saving submission result', error });
  }
};