const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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


app.get('/campgrounds', async (req, res, next) => {
    try {
        const allCamps = await Campground.find({});
        res.render('campgrounds/show', {allCamps});
    } catch (err) {
        next(err);
    }
});

app.get('/campgrounds/add_camp', (req, res, next) => {
    res.render('campgrounds/create');
});

app.post('/campgrounds/add_camp', async (req, res, next) => {
    const {title, description, price, location} = req.body;
    const newCamp = new Campground({
        title: title,
        description: description,
        price: price,
        location: location,
        image: "https://source.unsplash.com/800x600/?campground",
    });

    try {
        await newCamp.save()
        res.redirect('/campgrounds');
    } catch (err) {
        next(err);
    }
});

app.get('/campgrounds/search', async (req, res,next) => {
    const {campGroundName} = req.query;
    console.log(campGroundName);
    try {
        const foundCampground = await Campground.findOne({title: campGroundName});
        res.redirect(`/campgrounds/${foundCampground._id}`);
    } catch(err) {
        next(err);
    }
});

app.get('/campgrounds/:id/edit', async (req, res, next) => {
    const {id} = req.params;
    try {
        const foundCamp = await Campground.findById(id);
        res.render('campgrounds/edit', {foundCamp});
    } catch(err) {
        next(err);
    }
});

app.get('/campgrounds/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const foundCamp = await Campground.findById(id).populate('reviews');
        // console.log(foundCamp.title);
        // console.log(foundCamp.reviews);
        res.render('campgrounds/details', {foundCamp});
    } catch(err) {
        next(err);
    }
});

app.delete('/campgrounds/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const foundCamp = await Campground.findById(id);
        for(reviewId of foundCamp.reviews) {
            await Review.findByIdAndDelete(reviewId);
        }
        await Campground.deleteOne({_id: id});
        res.redirect('/campgrounds');
        console.log("Successfully deleted");
    } catch(err) {
        next(err);
    }
});

app.put('/campgrounds/:id', async (req, res, next) => {
    const {id} = req.params;
    const {title, description, price, location} = req.body;
    console.log(id);
    console.log(`{${title}, ${description}, ${price}, ${location}}`)
    try {
        const foundCamp = await Campground.findById(id);
        foundCamp.title = title;
        foundCamp.description = description;
        foundCamp.price = price;
        foundCamp.location = location;
        await foundCamp.save();
        res.redirect(`/campgrounds/${id}`);
        console.log(`Successfully edited ${foundCamp.title}`);
    } catch(err) {
        next(err);
    }
});


app.post('/campgrounds/:id/reviews', async (req, res, next) => {
    const {rating, body} = req.body;
    const {id: campId} = req.params;
    const newReview = new Review({
        body: body,
        rating: rating,
    });
    try {
        await newReview.save();
        const correspondingCamp = await Campground.findById(campId);
        correspondingCamp.reviews.push(newReview._id);
        await correspondingCamp.save();
        res.redirect(`/campgrounds/${campId}`)
    } catch(err) {
        next(err);
    }
});

app.delete('/campgrounds/:campId/reviews/:reviewId', async(req, res, next) => {
    const {campId, reviewId} = req.params;
    try {
        const foundCamp = await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/campgrounds/${campId}`);
    } catch(err) {
        next(err);
    }
});


app.use((err,req,res,next) => {
    console.log(err);
    res.render('campgrounds/error');
});

app.listen(8888, () => {
    console.log("Listening on PORT 8888");
});