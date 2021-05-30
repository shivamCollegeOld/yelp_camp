const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    image: String,
});

module.exports = mongoose.model('Campground', campgroundSchema);