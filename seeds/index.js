const mongoose = require('mongoose');
const cities = require('./cities');
const descriptions = require('./descriptions');
const images = require('./images');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const review = require('../models/review');
const user = require('../models/user');
const dbUrl = 'mongodb+srv://admin_fuad:royi3fFBEA5pCs2k@devcluster.1bpa6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    
// Connecting mongoose database
mongoose.connect(dbUrl);

// Displaying mongoose success or error messages on the console
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Function for returning any random value from a given array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    // Delete all previous entries on first execution of this file.
    await Campground.deleteMany({});
    await review.deleteMany({});
    await user.deleteMany({});

    // Create the default user
    const defaultUser = new user({
        email : "fuad@gmail.com", 
        username : "Fuad", 
        salt : "421720b46bdd37c74536b1f1791d61430a6c44198f9737272f31a84568bff521", 
        hash : "2a47181948a591ede3cf85de740fdb1e123f5d00a15dee8c4f4a2f02991238dfa1be99ebfda78fc9a93a8b49b55032f838947aa69360ce5de8ccb360dd2b128e385754290b00893d7043fb3d16ba8c7ba934d39e69b828a4b040d31fa099f21c90ee2b3569aace453d7c4d3640bb502cf7784093a95653ec31c684aa215285a1b92c95684c3e26db43940ec7861358a222e4902eb979742d147b17648f8b22d2b93d0610c3de92216ce1ad4613109fb75ef1873acb3931dddf549b2fca06603059014322e29eb511cf10446604a5ec97e322644f7935699b2e04c053c083273c260d891226f6b9253cdd068ba7465757b4b6ba99f254fa9618e59d8eee11bf51a1c9c83863076d181958c8bce92370cb2e46d7d33c87fd2006482255e5f83173628d04b1e98bd19a3de53fa3e8e55a2c3b0c89e17fa21f78c03a7858506fe117d9082f76b5555678db864c4dc24598bc763ddf5c489bdc8d9f553f11d9c6a921a2005b7cfeb3b8e0e58fcf00dd0ab137aaad40075909e0e4b66dc44faa5a6b1c1073d5f7311ea5bc2af90677cbd2c3b361a0bb9bda337d293060a24bc425effb3e2645c08cfe993214e1bf9251e35adac99d983188337a471df4bb63f766661fa8fd671b86b589d086bb8160d2f2b7a157b0f691d67da9b6dc90c3662f81dda66a78fdd2d965a908e407998308c3971b979e940096b092be16ba0b35fe6c49f7",
    });

    const savedUser = await defaultUser.save();

    // Create 50 random records with locations and titles of the campgrounds
    for(let i=0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const randomImages = [];
        const numberOfImages = 1 + random1000 % 5;
        for(let i=0; i < numberOfImages; i++){
            randomImages[i] = images[(random1000 + i) % images.length];
        }
        const camp = new Campground({
            author: savedUser._id,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `${descriptions[random1000 % descriptions.length]}`,
            price,
            geometry: { 
                type : "Point", 
                coordinates : [ cities[random1000].longitude, cities[random1000].latitude ] 
            },
            images: randomImages
        });

        const savedCamp = await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});