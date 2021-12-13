const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const campgroundController = require('../controllers/campgroundController');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgroundController.index)) // Link for displaying all campgrounds within the database.
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground)); // Link for uploading the data collected from the form adding a new campground.

// Link for a form to add new campgrounds to the application
router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground)) // Link for redirecting to the details of a campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.updateCampground)) // Link for submission of updated data for the campground.
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground)); // Link for deleting a campground

// Link for accessing the form for updating existing campground data.
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = router;