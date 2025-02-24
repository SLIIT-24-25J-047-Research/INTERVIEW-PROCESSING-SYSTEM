const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library'); // Import Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Your Google Client ID


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

    // Check if user exists and include the password in the query
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found");

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password match, generating token");
    console.log("User:", user.name);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send back the token, user role, and email
    return res.json({
      token,
      role: user.role,
      email: user.email,
      name: user.name 
      
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
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
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload(); // Google payload
      console.log("Backend Google Payload:", payload); // Log in backend terminal

      const email = payload.email.toLowerCase();
      console.log("Email Being Queried:", email); // Log queried email

      let user = await User.findOne({ email });

      if (!user) {
          console.log("User Not Found, Creating New User...");
          user = new User({
              email,
              name: payload.name,
              role: 'candidate',
              googleId: payload.sub,
          });
          await user.save();
      } else {
          console.log("User Found:", user);
      }

      const jwtToken = jwt.sign(
          { id: user._id, role: user.role, email: user.email,  name: user.name, googleId: user.googleId },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      return res.json({ token: jwtToken, role: user.role, email: user.email, name: user.name });

  } catch (error) {
      console.error("Google Login Error:", error);
      return res.status(500).json({ message: "Server error" });
  }
};


const googleSignup = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract user information from the Google token
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if the user already exists in the database
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists, verify Google ID to confirm ownership
      if (existingUser.googleId && existingUser.googleId === googleId) {
        // Generate a new token and log them in
        const jwtToken = jwt.sign(
          { id: existingUser._id, role: existingUser.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          message: "Logged in successfully",
          token: jwtToken,
          role: existingUser.role,
        });
      } else {
        // Google ID mismatch; potential security issue
        return res.status(403).json({
          message: "Account already exists but Google ID does not match. Please use your registered method to log in.",
        });
      }
    }

    // If the user doesn't exist, create a new user with Google ID
    const newUser = new User({
      email,
      name,
      role: 'candidate',
      googleId, // Store the Google ID here
    });

    await newUser.save();

    // Generate JWT token for the new user
    const newToken = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token and user role
    res.status(201).json({
      message: "Google signup successful",
      token: newToken,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error during Google signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserProfile = async (req, res) => {
  try {
 
   const user = await User.findById(req.params.id).select('+password');

   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }

   const hasPassword = Boolean(user.password);

    const userProfile = {
      id: user._id,
      email: user.email || '',
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
      skills: user.skills || [],
      password: hasPassword ? user.password : '',
      hasPassword 
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "location",
      "currentRole",
      "bio",
      "profilePicture",
      "experience",
      "education",
      "skills"
    ];

    const updateFields = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

  
    if (!currentPassword || typeof currentPassword !== 'string') {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'No password set for this user' });
    }

    console.log("Entered Password:", currentPassword);
    console.log("Hashed Password from DB:", user.password);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("Password Match:", isMatch); 

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, include an uppercase letter, and a number.'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in updatePassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = { login, register, getUserData, googleLogin, googleSignup, getUserProfile, updateProfile, updatePassword };
