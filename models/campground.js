const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Campground', campgroundSchema);