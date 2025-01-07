
const mongoose = require('mongoose');

const technicalInterviewScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
  userName: { type: String, required: true },  
  testDate: { type: Date, required: true },  
  testTime: { type: String, required: true },  
  duration: { type: Number, required: true },  
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'updated','completed', 'not attended', 'canceled'],
    default: 'scheduled', 
  },
  testLink: { type: String, required: true }, 
});

const TechnicalInterviewSchedule = mongoose.model('Technical-InterviewSchedule', technicalInterviewScheduleSchema);

module.exports = TechnicalInterviewSchedule;
