const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewController = require('../controllers/reviewController')
const {isLoggedIn} = require('../middleware');

const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn, reviewController.createReview);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;