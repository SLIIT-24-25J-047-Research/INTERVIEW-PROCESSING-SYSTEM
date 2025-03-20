// backend/controllers/candidateResultController.js
const CandidateResult = require('../../models/candidate/CandidateResult');

// Controller to save the mockup test result
exports.saveTestResult = async (req, res) => {
  const { email, score } = req.body;

  // Ensure that the email and score are provided
  if (!email || score === undefined) {
    return res.status(400).json({ message: 'Email and score are required' });
  }

  try {
    // Check if the candidate's result already exists
    const existingResult = await CandidateResult.findOne({ email });

    if (existingResult) {
      // If a result exists, update the score
      existingResult.score = score;
      existingResult.testDate = Date.now();
      await existingResult.save();
      return res.status(200).json({ message: 'Result updated successfully' });
    }

    // If no result exists, create a new record
    const newResult = new CandidateResult({
      email,
      score,
    });

    await newResult.save();
    return res.status(201).json({ message: 'Result saved successfully' });
  } catch (error) {
    console.error('Error saving test result:', error);
    return res.status(500).json({ message: 'Error saving test result' });
  }
};

// Controller to fetch the mockup test result by email
exports.getTestResultByEmail = async (req, res) => {
  const { email } = req.params; // Get email from request parameters

  try {
    // Find the candidate result by email
    const result = await CandidateResult.findOne({ email });

    if (!result) {
      return res.status(404).json({ message: 'No result found for this email' });
    }

    // Return the found result
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching test result:', error);
    return res.status(500).json({ message: 'Error fetching test result' });
  }
};
