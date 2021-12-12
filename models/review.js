const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');


// Defining the database schema for the table
const reviewSchema = new Schema({
    body: String,
    rating: {
        type: Number,
        required: [true, "Review must have a rating"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// Exporting the schema to access it from other files
module.exports = mongoose.model("Review", reviewSchema);