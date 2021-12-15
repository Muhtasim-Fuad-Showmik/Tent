const Campground = require('../models/campground');
const paginate = require('express-paginate');
const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    // Collecting the search query
    const { q } = req.query;

    // Generating search configurations using regex
    let options = {};
    let results;
    let itemCount;
    const campgroundsForMap = await Campground.find({});
    if(q) {
        // Fetching searched campgrounds.
        [results, itemCount] = await Promise.all([
            Campground.find({ $text: {$search: q} }).limit(req.query.limit).skip(req.skip).lean().exec(),
            Campground.find({ $text: {$search: q} }).count({})
        ]);
    } else {
        // Fetching all campgrounds.
        [results, itemCount] = await Promise.all([
            Campground.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
            Campground.find({}).count({})
        ]);
    }

    const pageCount = Math.ceil(itemCount / req.query.limit);
    const currentPage = req.query.page;
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);

    let previousPage = pages.filter(page => {
        return page.number === currentPage - 1;
    });
    previousPage = previousPage[0];
    let nextPage = pages.filter(page => {
        return page.number === currentPage + 1;
    });
    nextPage = nextPage[0];

    res.render('campgrounds/index', {
        campgrounds: results,
        campgroundsForMap,
        pageCount,
        itemCount,
        previousPage,
        currentPage,
        nextPage,
        pages
    });

    // Sending all campgrounds to the ejs file for rendering.
    // res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map( f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find the campground that you are looking for.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map( f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
};