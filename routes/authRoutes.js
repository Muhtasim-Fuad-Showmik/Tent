const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const authController = require('../controllers/authController');

router.get('/register', authController.renderRegisterForm);

router.post('/register', catchAsync(authController.register));

router.get('/login', authController.renderLoginForm);

router.post('/login', 
    passport.authenticate('local', 
    { 
        failureFlash: true, 
        failureRedirect: '/login'
    }),  authController.login);

router.get('/logout', authController.logout);

module.exports = router;