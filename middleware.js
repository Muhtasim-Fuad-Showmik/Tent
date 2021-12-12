const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first.');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    // Collecting the details of the validation error
     const { error } = campgroundSchema.validate(req.body);
     if(error){
         // Mapping over the details of the validation error and converting the
         // contents into a commma separated string to use as an error message.
         const msg = error.details.map(el => el.message).join(', ');
         throw new ExpressError(msg, 422);
     } else {
         next();
     }
 }

module.exports.isAuthor = async(req, res, next) => {
     const { id } = req.params;
     const campground = await Campground.findById(id);
     if( !campground.author.equals(req.user._id)) {
         req.flash('error', 'You do not have sufficient permission for this action.');
         return res.redirect(`/campgrounds/${ id }`);
     }
     next();
 }

 module.exports.validateReview = (req, res, next) => {
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

 module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    console.log(id, reviewId);
    const review = await Review.findById(reviewId);
    if( !review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have sufficient permission for this action.');
        return res.redirect(`/campgrounds/${ id }`);
    }
    next();
}