const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User authentication routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);

// Route to get user profile by email (uses GET request and URL parameter)
router.get('/:email', userController.findByEmail);

// Route to update user profile (uses PUT request and sends data in body)
router.put('/update-profile', userController.updateProfile); // Added this route

module.exports = router;