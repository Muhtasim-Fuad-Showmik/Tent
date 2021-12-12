const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const campgroundController = require('../controllers/campgroundController');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// Link for displaying all campgrounds within the database.
router.get('/', catchAsync(campgroundController.index));

// Link for a form to add new campgrounds to the application
router.get('/new', isLoggedIn, campgroundController.renderNewForm);

// Link for uploading the data collected from the for adding a new campground.
router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground));

// Link for redirecting to the details of a campground
router.get('/:id', catchAsync(campgroundController.showCampground));

// Link for accessing the form for updating existing campground data.
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

// Link for submission of updated data for the campground.
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.updateCampground));

// Link for deleting a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

module.exports = router;