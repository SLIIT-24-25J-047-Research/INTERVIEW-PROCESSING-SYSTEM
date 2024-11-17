const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  prediction: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
