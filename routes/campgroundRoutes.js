const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

// Link for displaying all campgrounds within the database.
router.get('/', catchAsync(async (req, res) => {
    // Fetching all campgrounds.
    const campgrounds = await Campground.find({});
    // Sending all campgrounds to the ejs file for rendering.
    res.render('campgrounds/index', { campgrounds })
}))

// Link for a form to add new campgrounds to the application
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// Link for uploading the data collected from the for adding a new campground.
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`campgrounds/${campground._id}`);
}))

// Link for redirecting to the details of a campground
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find the campground that you are looking for.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

// Link for accessing the form for updating existing campground data.
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find the campground that you are looking for.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

// Link for submission of updated data for the campground.
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Link for deleting a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;