const CodeExecutor = require('../../utils/codeSandbox');

const executor = new CodeExecutor();

exports.executeCode = async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    // Input validation
    if (!question || !answer || !question.content || !question.content.testCases) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data format'
      });
    }

    // Validate question type and language
    if (question.type !== 'code' || question.content.language !== 'javascript') {
      return res.status(400).json({
        success: false,
        error: 'Only JavaScript code questions are supported'
      });
    }

    // Find the specific answer for this question
    const userAnswer = answer.answers[0].answers.find(
      a => a.questionId === question._id
    );

    if (!userAnswer) {
      return res.status(400).json({
        success: false,
        error: 'Answer not found for this question'
      });
    }

    // Execute the code
    const results = await executor.executeJavaScript(
      userAnswer.response,
      question.content.testCases
    );

    // Calculate overall results
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const averageExecutionTime = results.reduce((acc, r) => acc + (r.executionTime || 0), 0) / totalTests;

    return res.json({
      success: true,
      results: {
        testResults: results,
        summary: {
          totalTests,
          passedTests,
          averageExecutionTime,
          score: (passedTests / totalTests) * question.points
        }
      }
    });

  } catch (error) {
    console.error('Code execution error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during code execution'
    });
  }
};
