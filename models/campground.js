
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the database schema for the table
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

// Exporting the schema to access it from other files
module.exports = mongoose.model('Campground', CampgroundSchema);