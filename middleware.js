const Campground = require('./models/campground');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('failure', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    try {
        const foundCampground = await Campground.findById(id);
        if(!foundCampground) {
            req.flash('failure', 'Could not find what you were looking for!');
            return res.redirect(`/campgrounds/${id}`);
        }
        if(!foundCampground.author.equals(req.user._id)) {
            req.flash('failure', 'You are not allowed to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    } catch(err) {
        next(err);
    }
}