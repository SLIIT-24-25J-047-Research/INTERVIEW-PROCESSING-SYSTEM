const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: { 
    type: String, 
    required: function() { return !this.googleId; }, 
    select: false 
  },
  location: {
    type: String,
    default: ''
  },
  currentRole: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['interviewer', 'candidate'],
    default: 'candidate'
  },
  experience: [{
    role: String,
    company: String,
    duration: String
  }],
  education: [{
    degree: String,
    institution: String
  }],
  skills: [String],
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  }
}, { 
  timestamps: true 
});

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);