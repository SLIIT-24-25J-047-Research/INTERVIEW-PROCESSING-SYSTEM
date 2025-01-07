const Prediction = require("../../models/candidate/Prediction");

exports.savePrediction = async (req, res) => {
  const { email, prediction } = req.body;

  if (!email || !prediction) {
    return res.status(400).json({ error: "Email and prediction are required" });
  }

  try {
    const newPrediction = new Prediction({ email, prediction });
    await newPrediction.save();
    return res.status(200).json({ message: "Prediction saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save prediction" });
  }
};

// Function to get a single prediction (for a given email)
exports.getPrediction = async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch the prediction by email from the database
    const prediction = await Prediction.findOne({ email });

    if (!prediction) {
      return res.status(404).json({ error: "Prediction not found for this email" });
    }

    return res.status(200).json({ prediction: prediction.prediction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch prediction" });
  }
};

// Function to get all predictions and determine the most frequent prediction
exports.getAllPredictions = async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch all predictions for the given email
    const predictions = await Prediction.find({ email });

    if (predictions.length === 0) {
      return res.status(404).json({ error: "No predictions found for this email" });
    }

    // Count the occurrences of each prediction
    const predictionCount = predictions.reduce((acc, curr) => {
      acc[curr.prediction] = (acc[curr.prediction] || 0) + 1;
      return acc;
    }, {});

    // Find the most frequent prediction
    const mostFrequentPrediction = Object.keys(predictionCount).reduce((a, b) =>
      predictionCount[a] > predictionCount[b] ? a : b
    );

    return res.status(200).json({ prediction: mostFrequentPrediction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch predictions" });
  }
};
