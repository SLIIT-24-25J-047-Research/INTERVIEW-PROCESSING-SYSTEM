const mongoose = require('mongoose');

const userCVSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User',
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserCV', userCVSchema);
