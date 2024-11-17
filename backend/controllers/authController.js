const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const register = async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (hashing is done automatically in the User schema)
    const newUser = new User({
      email,
      password, // No need to hash here, it's handled in the schema
      role,
      name,
    });

    await newUser.save();

    // Generate JWT token after successful registration
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token and user role
    res.status(201).json({
      token,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Checking for user with email:", email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" }); // Return response and stop further execution
    }

    console.log("User found:");

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" }); // Return response and stop further execution
    }

    console.log("Password match, generating token");

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, // Include email in JWT payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiration time
    );

    // Send back the token, user role, and email
    return res.json({
      token,
      role: user.role,
      email: user.email, // Include email in the response
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" }); // Return response and stop further execution
  }
};


// Get logged-in user data based on email query
const getUserData = async (req, res) => {
  const { email } = req.query;  // Retrieve the email from query parameters

  try {
    // Validate if email exists
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("-password");  // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other fields you want to return
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//---

module.exports = { login, register, getUserData };
