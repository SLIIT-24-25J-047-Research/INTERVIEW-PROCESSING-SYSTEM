const InterviewAnswer = require('../../models/employer/TechnicalAnswers');
const User = require('../../models/User');  // Import User model
const Question = require('../../models/employer/TechnicalQuestions');

// Submit answers

exports.submitAnswers = async (req, res) => {
  try {
    const { interviewId, userId, answers } = req.body;

    if (!interviewId || !userId || !answers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    // Validate userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    for (const answer of answers) {
      const { questionId, type, response } = answer;

      if (!questionId || !type || !response) {
        return res.status(400).json({ message: 'Each answer must include questionId, type, and response' });
      }

      // Validate questionId
      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(400).json({ message: 'Invalid questionId' });
      }

      switch (type) {
        case 'code':
          if (typeof response !== 'string') {
            return res.status(400).json({ message: 'Code response must be a string' });
          }
          break;

        case 'multipleChoice':
          if (typeof response !== 'number') {
            return res.status(400).json({ message: 'Multiple choice response must be a number' });
          }
          break;

        case 'dragDrop':
          if (!Array.isArray(response)) {
            return res.status(400).json({ message: 'Drag-and-drop response must be an array' });
          }
          break;

        case 'fillBlanks':
          if (typeof response !== 'object' || Array.isArray(response)) {
            return res.status(400).json({ message: 'Fill-in-the-blanks response must be an object' });
          }
          break;

          case 'objectMechanic':
            // Allow objectMechanic response to be a string (for code or structured text)
            if (typeof response !== 'string') {
              return res.status(400).json({ message: 'ObjectMechanic response must be a string' });
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
    const { userId, interviewId } = req.params;
    
    const submissions = await InterviewAnswer.find({ userId, interviewId })
      .populate('userId')
      .populate('interviewId');

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching answers', error });
  }
};


exports.getAllAnswersGroupedByInterview = async (req, res) => {
  try {
    const groupedAnswers = await InterviewAnswer.aggregate([
      {
        $group: {
          _id: "$interviewId",
          answers: { $push: "$$ROOT" }
        }
      }
    ]);

    res.status(200).json(groupedAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grouped answers', error });
  }
};