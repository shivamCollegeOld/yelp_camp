const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    body: String,
    rating: {
        type: Number,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Review',reviewSchema);