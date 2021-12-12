const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const authController = require('../controllers/authController');
const { route } = require('express/lib/application');

router.route('/register')
    .get(authController.renderRegisterForm)
    .post(catchAsync(authController.register));

router.route('/login')
    .get(authController.renderLoginForm)
    .post(
    passport.authenticate('local', 
    { 
        failureFlash: true, 
        failureRedirect: '/login'
    }),  authController.login);

router.get('/logout', authController.logout);

module.exports = router;