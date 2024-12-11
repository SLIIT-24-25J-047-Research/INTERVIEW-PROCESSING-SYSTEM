const express = require('express');
const router = express.Router();
const { register, login, getUserData, googleLogin, googleSignup } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public

router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login a user
// @access  Public

router.post('/login', login);
router.get('/login', getUserData);

router.post('/google-signup', googleSignup);
router.post('/glogin', googleLogin);
module.exports = router;
