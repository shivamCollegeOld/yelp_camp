const User = require('../models/user');

const authController = {

    renderRegisterForm: (req, res, next) => {
        res.render('auth/register');
    },

    createUser: async (req, res, next) => {
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
    },
    
    renderLoginForm: (req, res, next) => {
        res.render('auth/login');
    },

    loginUser: (req, res, next) => {
        req.flash('success', `Welcome back, ${req.user.username}!`);
        res.redirect('/campgrounds');
    },

    logoutUser: (req, res, next) => {
        req.logout();
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    },
};

module.exports = authController;