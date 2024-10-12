const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const register = async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (hashing is done automatically in the User schema)
    const newUser = new User({
      email,
      password, // No need to hash here, it's handled in the schema
      role,
      name
    });

    await newUser.save();

    // Generate JWT token after successful registration
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token and user role
    res.status(201).json({
      token,
      role: newUser.role
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Checking for user with email:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' }); // Added return to stop further execution
    }

    console.log('User found:');

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' }); // Added return to stop further execution
    }

    console.log('Password match, generating token');

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send back the token and user role
    return res.json({
      token,
      role: user.role
    }); // Ensure this is the last response

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' }); // Added return to stop further execution
  }
};
//---

module.exports = { login , register };
