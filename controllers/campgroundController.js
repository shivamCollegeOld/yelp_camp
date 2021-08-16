const Campground = require('../models/campground');


const campgroundController = {

    renderAllCamps: async (req, res, next) => {
        try {
            const allCamps = await Campground.find({});
            res.render('campgrounds/show', {allCamps});
        } catch (err) {
            next(err);
        }
    },

    renderNewCampForm: (req, res, next) => {
        res.render('campgrounds/create');
    },

    createCampground: async (req, res, next) => {
        console.log(req.files);
        const {title, description, price, location} = req.body;
        const newCamp = new Campground({
            title: title,
            description: description,
            price: price,
            location: location,
            // image: "https://source.unsplash.com/800x600/?campground",
            author: req.user._id,
            images: req.files.map(img => ({url: img.path, filename: img.filename})),
        });
        console.log(newCamp);
        try {
            await newCamp.save();
            req.flash('success', 'Campground added successfully!');
            res.redirect('/campgrounds');
        } catch (err) {
            next(err);
        }
    },

    // searchByName: async (req, res, next) => {
    //     const {campGroundName} = req.query;
    //     console.log(campGroundName);
    //     try {
    //         const foundCampground = await Campground.findOne({title: campGroundName});
    //         res.redirect(`/campgrounds/${foundCampground._id}`);
    //     } catch(err) {
    //         next(err);
    //     }
    // },

    renderCampgroundDetails: async (req, res, next) => {
        const {id} = req.params;
        try {
            const foundCamp = await Campground.findById(id).populate('author').populate({path: 'reviews', populate: {path: 'author'}});
            // for(let review of foundCamp.reviews) {
            //     review.populate('author');
            // }
            console.log(foundCamp.reviews);
            res.render('campgrounds/details', {foundCamp});
        } catch(err) {
            next(err);
        }
    },

    renderEditForm: async (req, res, next) => {
        const {id} = req.params;
        try {
            const foundCamp = await Campground.findById(id);
            res.render('campgrounds/edit', {foundCamp});
        } catch(err) {
            next(err);
        }
    },

    editCampground: async (req, res, next) => {
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
            const newImgs = req.files.map(img => ({url: img.path, filename: img.filename}));
            foundCamp.images.push(...newImgs);
            await foundCamp.save();
            req.flash('success', 'Campground edited successfully!');
            res.redirect(`/campgrounds/${id}`);
            console.log(`Successfully edited ${foundCamp.title}`);
        } catch(err) {
            next(err);
        }
    },

    deleteCampground: async (req, res, next) => {
        const {id} = req.params;
        try {
            const foundCamp = await Campground.findById(id);
            for(reviewId of foundCamp.reviews) {
                await Review.findByIdAndDelete(reviewId);
            }
            await Campground.deleteOne({_id: id});
            req.flash('success', 'Campground deleted successfully!');
            res.redirect('/campgrounds');
            console.log("Successfully deleted");
        } catch(err) {
            next(err);
        }
    },
};

module.exports = campgroundController;