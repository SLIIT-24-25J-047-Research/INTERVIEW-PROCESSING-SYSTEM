const express = require('express');
const router = express.Router();
const { register, login, getUserData, googleLogin, googleSignup, getUserProfile, updateProfile, updatePassword } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public

router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login a user
// @access  Public
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateProfile);
router.put('/profile/:id/password', updatePassword);

router.post('/login', login);
router.get('/login', getUserData);

router.post('/google-signup', googleSignup);
router.post('/glogin', googleLogin);



module.exports = router;
