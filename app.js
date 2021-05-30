const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');


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


app.get('/campgrounds', async (req, res) => {
    try {
        const allCamps = await Campground.find({});
        res.render('campgrounds/show', {allCamps});
    } catch (err) {
        console.log("Error in fetching all camps data!");
        res.render('campgrounds/error');
    }
});

app.get('/campgrounds/add_camp', (req, res) => {
    res.render('campgrounds/create');
});

app.get('/campgrounds/search', async (req, res) => {
    const {campGroundName} = req.query;
    console.log(campGroundName);
    try {
        //console.log("here1");
        const foundCampground = await Campground.findOne({title: campGroundName});
        //console.log(foundCampground);
        res.redirect(`/campgrounds/${foundCampground._id}`);
    } catch(err) {
        res.render('campgrounds/error');
    }
});

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    //console.log("here2");
    try {
        const foundCamp = await Campground.findById(id);
        console.log(foundCamp.title);
        res.render('campgrounds/details', {foundCamp});
    } catch(err) {
        console.log("Error in fetching campground by id");
        res.render('campgrounds/error');
    }
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    //console.log(id);
    //console.log("here3");
    try {
        //console.log("reached here1");
        const foundCamp = await Campground.findById(id);
        //console.log("reached here2");
        res.render('campgrounds/edit', {foundCamp});
    } catch(err) {
        console.log("Error in fetching campground by id");
        //console.log(err);
        res.render('campgrounds/error');
    }
});

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await Campground.deleteOne({_id: id});
        res.redirect('/campgrounds');
        console.log("Successfully deleted");
    } catch(err) {
        alert("No record found");
        res.render('campgrounds/error');
    }
});

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const {title, description, price, location} = req.body;
    try {
        const foundCamp = await Campground.findById(id);
        foundCamp.title = title;
        foundCamp.description = description;
        foundCamp.price = price;
        foundCamp.location = location;
        await foundCamp.save();
        res.redirect(`/campgrounds/${id}`);
        console.log("Successfully deleted");
    } catch(err) {
        alert("No record found");
        res.render('campgrounds/error');
    }
});

app.post('/campgrounds/add_camp', async (req, res) => {
    const {title, price, location} = req.body;
    const newCamp = new Campground({
        title: title,
        price: price,
        location: location,
    });

    try {
        await newCamp.save()
        res.redirect('/campgrounds');
    } catch (err) {
        console.log("Error in saving new Campground data");
        res.render('campgrounds/error');
    }
});

app.listen(8888, () => {
    console.log("Listening on PORT 8888");
});