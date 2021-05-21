const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.get('/campgrounds', async (req, res) => {
    if(req.query.id) {
        const {id} = req.query;
        try {
            const foundCamp = await Campground.findById(id);
            res.render('campgrounds/details', {foundCamp});
        } catch(err) {
            console.log("Error in fetching campground by id");
        }
    } else {
        try {
            const allCamps = await Campground.find({});
            res.render('campgrounds/show', {allCamps});
        } catch (err) {
            console.log("Error in fetching all camps data!");
        }
    }
});

app.delete('/campgrounds', async (req, res) => {
    const {id} = req.query;
    try {
        await Campground.deleteOne({_id: id});
        res.redirect('/campgrounds');
        console.log("Successfully deleted");
    } catch(err) {
        alert("No record found");
        res.redirect('/campgrounds');
    }
});

app.patch('/campgrounds', async (req, res) => {
    const {id} = req.query;
    const {title, description, price, location} = req.body;
    try {
        const foundCamp = await Campground.findById(id);
        foundCamp.title = title;
        foundCamp.description = description;
        foundCamp.price = price;
        foundCamp.location = location;
        await foundCamp.save();
        res.redirect('/campgrounds?id='+`${id}`);
        console.log("Successfully deleted");
    } catch(err) {
        alert("No record found");
        res.redirect('/campgrounds');
    }
});

app.get('/campgrounds/add_camp', (req, res) => {
    res.render('campgrounds/create');
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
    }
});

app.listen(8888, () => {
    console.log("Listening on PORT 8888");
});