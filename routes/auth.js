const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/register', authController.renderRegisterForm);
router.post('/register', authController.createUser);
router.get('/login', authController.renderLoginForm);
router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;