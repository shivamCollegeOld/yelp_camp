const express = require('express');
const Campground = require('../models/campground');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const allCamps = await Campground.find({});
        res.render('campgrounds/show', {allCamps});
    } catch (err) {
        next(err);
    }
});

router.get('/add_camp', (req, res, next) => {
    res.render('campgrounds/create');
});

router.post('/add_camp', async (req, res, next) => {
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

router.get('/search', async (req, res,next) => {
    const {campGroundName} = req.query;
    console.log(campGroundName);
    try {
        const foundCampground = await Campground.findOne({title: campGroundName});
        res.redirect(`/campgrounds/${foundCampground._id}`);
    } catch(err) {
        next(err);
    }
});

router.get('/:id/edit', async (req, res, next) => {
    const {id} = req.params;
    try {
        const foundCamp = await Campground.findById(id);
        res.render('campgrounds/edit', {foundCamp});
    } catch(err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
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

router.delete('/:id', async (req, res, next) => {
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

router.put('/:id', async (req, res, next) => {
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



module.exports = router;