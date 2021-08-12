const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');

const router = express.Router({mergeParams: true});

router.post('/', async (req, res, next) => {
    const {rating, body} = req.body;
    const {campId} = req.params;
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

router.delete('/:reviewId', async(req, res, next) => {
    const {campId, reviewId} = req.params;
    try {
        const foundCamp = await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/campgrounds/${campId}`);
    } catch(err) {
        next(err);
    }
});

module.exports = router;