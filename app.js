const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const Campground = require('./models/campground');
const Review = require('./models/review');
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
app.use(cookieParser());


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:campId/reviews',reviews);


app.use((err,req,res,next) => {
    console.log(err);
    res.render('campgrounds/error');
});

app.listen(8888, () => {
    console.log("Listening on PORT 8888");
});