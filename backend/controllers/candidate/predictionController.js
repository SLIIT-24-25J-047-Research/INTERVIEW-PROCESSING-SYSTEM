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
