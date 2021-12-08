
const mongoose = require('mongoose');
const Review = require('./review');
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