const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    location: String,
});

module.exports = mongoose.model('Campground', campgroundSchema);