const express = require('express');
const multer = require('multer');
const {storage} = require('../cloudinaryConfig');
// const upload = multer({dest: 'uploads/'});
const upload = multer({storage});
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor} = require('../middleware')
const campgroundController = require('../controllers/campgroundController');
const router = express.Router();

router.get('/', campgroundController.renderAllCamps);
router.get('/add_camp', isLoggedIn, campgroundController.renderNewCampForm);
router.post('/add_camp', isLoggedIn, upload.array('images'), campgroundController.createCampground);
router.get('/:id', campgroundController.renderCampgroundDetails);
router.get('/:id/edit', isLoggedIn, isAuthor, campgroundController.renderEditForm);
router.put('/:id', isLoggedIn, isAuthor, upload.array('images'), campgroundController.editCampground);
router.delete('/:id', isLoggedIn, isAuthor, campgroundController.deleteCampground);

module.exports = router;

// router.get('/search', campgroundController.searchByName);