const InterviewAnswer = require('../../models/employer/TechnicalAnswers');

// Submit answers

exports.submitAnswers = async (req, res) => {
    try {
      const { interviewId, userId, answers } = req.body;
  
      // Validate required fields
      if (!interviewId || !userId || !answers) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Validate answers structure
      if (!Array.isArray(answers)) {
        return res.status(400).json({ message: 'Answers must be an array' });
      }
  
      // Process each answer based on the question type
      for (const answer of answers) {
        const { questionId, type, response } = answer;
  
        if (!questionId || !type || !response) {
          return res.status(400).json({ message: 'Each answer must include questionId, type, and response' });
        }
  
        // Validate and process based on question type
        switch (type) {
          case 'code':
            // Validate code response
            if (typeof response !== 'string') {
              return res.status(400).json({ message: 'Code response must be a string' });
            }
            break;
  
          case 'multipleChoice':
            // Validate multiple choice response
            if (typeof response !== 'number') {
              return res.status(400).json({ message: 'Multiple choice response must be a number' });
            }
            break;
  
          case 'dragDrop':
            // Validate drag-and-drop response
            if (!Array.isArray(response)) {
              return res.status(400).json({ message: 'Drag-and-drop response must be an array' });
            }
            break;
  
          case 'fillBlanks':
            // Validate fill-in-the-blanks response
            if (typeof response !== 'object' || Array.isArray(response)) {
              return res.status(400).json({ message: 'Fill-in-the-blanks response must be an object' });
            }
            break;
  
          default:
            return res.status(400).json({ message: 'Invalid question type' });
        }
      }
  
      // Save the submission to the database
      const interviewSubmission = new InterviewAnswer({
        interviewId,
        userId,
        answers,
      });
  
      await interviewSubmission.save();
      res.status(201).json({ message: 'Answers submitted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting answers', error });
    }
  };

// Get submitted answers by user
exports.getUserAnswers = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await InterviewAnswer.find({ userId }).populate('userId');

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching answers', error });
  }
};
