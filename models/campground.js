
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the database schema for the table
const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Campground must have a name']
    },
    image: {
        type: String,
        required: [true, 'Campground must have an image']
    },
    price: {
        type: Number,
        required: [true, 'Campground must have a declared price'],
        min: [0, 'Price must be positive']
    },
    description: {
        type: String,
        required: [true, 'Campground must contain a description']
    },
    location: {
        type: String,
        required: [true, 'Campground must state its location']
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Exporting the schema to access it from other files
module.exports = mongoose.model('Campground', CampgroundSchema);