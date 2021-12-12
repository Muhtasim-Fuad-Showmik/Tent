const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
//mergeParams need to be true as we need access to the parameters from the previous page.
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewController = require('../controllers/reviewController');
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Link for posting reviews into the database
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));

// Link for deleting reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;