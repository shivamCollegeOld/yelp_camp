const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrat = require('passport-local').Strategy;


const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
mongoose.connection.on("error", console.error.bind(console, "connection error: "));
mongoose.connection.once("open", () => {
    console.log("Database connection succesful!");
});


const app = express();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser('thisshouldbeabettersecret'));
const  sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    maxAge: 1000 * 60 * 60 * 24 * 7,
}
app.use(cookieSession(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.failure = req.flash('failure');
    next();
});

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:campId/reviews',reviewRoutes);
app.use('',authRoutes);


app.use((err,req,res,next) => {
    console.log(err);
    res.render('campgrounds/error');
});

app.listen(8888, () => {
    console.log("Listening on PORT 8888");
});