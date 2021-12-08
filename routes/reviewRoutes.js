const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeParams need to be true as we need access to the parameters from the previous page.
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    // Collecting the details of the validation error
     const { error } = reviewSchema.validate(req.body);
     if(error){
         // Mapping over the details of the validation error and converting the
         // contents into a commma separated string to use as an error message.
         const msg = error.details.map(el => el.message).join(', ');
         throw new ExpressError(msg, 422);
     } else {
         next();
     }
 }

// Link for posting reviews into the database
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Link for deleting reviews
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;