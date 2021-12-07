const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the database schema for the table
const reviewSchema = new Schema({
    body: String,
    rating: {
        type: Number,
        required: [true, "Review must have a rating"]
    }
})

// Exporting the schema to access it from other files
module.exports = mongoose.model("Review", reviewSchema);