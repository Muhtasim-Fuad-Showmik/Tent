
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the database schema for the table
const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be positive']
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

// Exporting the schema to access it from other files
module.exports = mongoose.model('Campground', CampgroundSchema);