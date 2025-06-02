const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController.js');
const router = express.Router();

// Route untuk Register
router.post('/register', registerUser);

// Route untuk Login
router.post('/login', loginUser);

// Route untuk Logout
router.post('/logout', logoutUser);

module.exports = router;
