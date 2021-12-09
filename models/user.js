const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

/**
 * Adds username, hash, salt and other fields and methods to 
 * the user Schema that allow the passport library to work
 * properly.
 */
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);