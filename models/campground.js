
const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

// Creating the Image Schema for generating thumbnails
const ImageSchema = new Schema({
    url: String,
    filename: String
});

// Generating thumbnails
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

// To add virtual fields into the JSON object after stringification.
const options = { toJSON: { virtuals: true } };

// Defining the database schema for the table
const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Campground must have a name']
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, options);

// Generating thumbnails
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>
    `;
});

/*
Link to execute after deletion process of the campground is complete,
to also remove all reviews that contain the campground id within it
as a reference.
*/ 
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// Exporting the schema to access it from other files
module.exports = mongoose.model('Campground', CampgroundSchema);