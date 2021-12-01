const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Rendering default page
app.get('/', (req, res) => {
    res.render('home')
})

// Link for creating a campground by default from within this file.
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping'});
    await camp.save();
    res.send(camp);
})

// Listeningi to the server using port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000')
})