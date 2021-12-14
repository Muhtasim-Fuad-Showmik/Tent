const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const review = require('../models/review');
    
// Connecting mongoose database
mongoose.connect('mongodb://localhost:27017/tent');

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

    // Create 50 random records with locations and titles of the campgrounds
    for(let i=0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61b5b62a96f674a626dc7d9a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, sint voluptatum similique omnis quibusdam, odit porro reprehenderit repudiandae placeat molestias vero a itaque. Totam corrupti ipsum nam quaerat quo doloremque.',
            price,
            geometry: { 
                type : "Point", 
                coordinates : [ -122.326863, 41.328285 ] 
            },
            images: [
                { 
                    "url" : "https://res.cloudinary.com/fuad-dev/image/upload/v1639382122/Tent/prp8uy1f6riak7hdnw8t.jpg",
                    "filename" : "Tent/prp8uy1f6riak7hdnw8t"
                }, 
                { 
                    "url" : "https://res.cloudinary.com/fuad-dev/image/upload/v1639382123/Tent/vidchxzeojxhnclc7lhn.jpg",
                    "filename" : "Tent/vidchxzeojxhnclc7lhn"
                },
                { 
                    "url" : "https://res.cloudinary.com/fuad-dev/image/upload/v1639382124/Tent/ouc8pbuwpic7m1eyqpev.jpg",
                    "filename" : "Tent/ouc8pbuwpic7m1eyqpev"
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});