const mongoose = require('mongoose');

const skillGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: { type: [String], required: true }, 
  focus: { type: String, enum: ['frontend', 'backend', 'fullstack'], required: true }, 
  groupId: { type: String, required: true, unique: true },  // Unique identifier for the group
});

module.exports = mongoose.model('SkillGroup', skillGroupSchema);
