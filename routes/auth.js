// Third-party packages
const express = require('express');
const {body} = require('express-validator/check');

// Imports
const authController = require('../controllers/auth');
const User = require("../models/user");

// Initilization
const router = express.Router();

// Set routes
router.get('/login', authController.getLogIn);
router.post('/login', authController.postLogIn);
router.post('/logout', authController.postLogOut);
router.get('/signup', authController.getSignUp);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword); 
router.post('/new-password', authController.postNewPassword);

router.post('/signup',
[
    body('email', 'Invalid email')
        .isEmail()
        .custom(value => {
            return User.findOne({email: value})
            .then(user => {
                if (user)
                {
                    return Promise.reject('Email already exists');
                }
                return true;
            });
        })
        .normalizeEmail(),
    body('password', 'Follow password requirements')
        .isLength({min: 5, max: 20})
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
        .custom((value, {req}) => {
            if (value != req.body.password)
            {
                return Promise.reject('Passwords do not match');
            }
            return true;
        })
],
authController.postSignUp);

// Export
module.exports = router;