const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.get('/register', (req, res, next) => {
    res.render('auth/register');
});

router.post('/register', async (req, res, next) => {
    const {username, email, password} = req.body;
    const newUser = new User({email,username});
    try {
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success',`Welcome to Yelp Camp, ${registeredUser.username}!`);
            res.redirect('/campgrounds');
        });
    } catch(err) {
        req.flash('failure', err.message);
        res.redirect('/register');
    }
});


router.get('/login', (req, res, next) => {
    res.render('auth/login');
});


router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res, next) => {
    req.flash('success', `Welcome back, ${req.user.username}!`);
    res.redirect('/campgrounds');
})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
});

module.exports = router;