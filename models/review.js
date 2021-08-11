const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    body: String,
    rating: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Review',reviewSchema);