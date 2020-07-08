// Third-party packages
const express = require('express');

// Imports
const authController = require('../controllers/auth');

// Initilization
const router = express.Router();

// Set routes
router.get('/login',authController.getLogIn);
router.post('/login',authController.postLogIn);
router.post('/logout',authController.postLogOut);

// Export
module.exports = router;