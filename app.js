const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
    
// Connecting mongoose database
mongoose.connect('mongodb://localhost:27017/tent');

// Displaying mongoose success or error messages on the console
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Setting up the view engine to be ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//All "app.use" content runs for every single request and response cycle.

// Used for parsing request bodies
app.use(express.urlencoded({extended: true}));
// Used for overriding methods and therefore generating several other method requests
app.use(methodOverride('_method'));

// Rendering default page
app.get('/', (req, res) => {
    res.render('home')
})

// Link for displaying all campgrounds within the database.
app.get('/campgrounds', async (req, res) => {
    // Fetching all campgrounds.
    const campgrounds = await Campground.find({});
    // Sending all campgrounds to the ejs file for rendering.
    res.render('campgrounds/index', { campgrounds })
})

// Link for a form to add new campgrounds to the application
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// Link for uploading the data collected from the for adding a new campground.
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
})

// Link for redirecting to the details of a campground
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
})

// Link for accessing the form for updating existing campground data.
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

// Link for submission of updated data for the campground.
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
})

// Link for deleting a campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// Listeningi to the server using port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000')
})