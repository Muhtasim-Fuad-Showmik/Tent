
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the database schema for the table
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

// Exporting the schema to access it from other files
module.exports = mongoose.model('Campground', CampgroundSchema);