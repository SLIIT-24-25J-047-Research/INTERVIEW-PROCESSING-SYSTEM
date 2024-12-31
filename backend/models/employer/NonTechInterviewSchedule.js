// models/InterviewSchedule.js
const mongoose = require('mongoose');

const interviewScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
  userName: { type: String, required: true },  
  interviewDate: { type: Date, required: true },  
  interviewTime: { type: String, required: true },  
  media: { type: String, required: true, enum: ['MS Teams', 'Zoom'] },  
  status: {
    type: String,
    enum: ['scheduled', 'updated', 'done', 'not attended', 'canceled'],
    default: 'scheduled', 
  },
});

const InterviewSchedule = mongoose.model('Non-Technical-InterviewSchedule', interviewScheduleSchema);

module.exports = InterviewSchedule;