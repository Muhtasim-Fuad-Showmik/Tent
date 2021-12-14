const mongoose = require('mongoose');
const cities = require('./cities');
const descriptions = require('./descriptions');
const images = require('./images');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const review = require('../models/review');
const user = require('../models/user');
    
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
    await user.deleteMany({});

    // Create the default user
    const defaultUser = new user({
        email : "fuad@gmail.com", 
        username : "Fuad", 
        salt : "5aeac9f65b1c37616089a51977247c2e9c6fe7bfa8ab7ac64f5f83a784f56ae1", 
        hash : "2db18cbd7c44938fd43b0b793a47eb1945357f135325cc72e0169eab5ba0cd10e08a8a9868af2e1ef2c18b635877124d15b1fa8381afcf594d8cce8a198c20431cd7299ea9f4d4dd8412262dd406082f9ec517893551cbe32d367009c5011c93b4f4e32150df6009c89dca1be27ed4429c34ec8e2cfebe8eb1db8734dafd4f67d413929a70e1a8b8351098b4fe6cdc6eebcdfafe58a252b95b7bc1806f58b967efcea8b64e6e8f829fc4638358a4c3828d81342cca951b17e003cb9b5e107e9a9b91ec9ed84d5410ba804c24434cbdc46885ae3b98216af37125af12c0b6b4794fe9873def39880e1b9bddb2e394d2d4641827707116b7e97198baa2502c779911d46b7e3ffb92c37bfba689f21f01dbdbd49f5d8ca49c70a6cd6cd86b9b7e31af98883e0906eea7f8d943f8f1b889d1e7e0c4752a64c56e031783f23b85d9301fa8c47cc326862bf01270533d7cf71e128796974c5c09f471247943e462acbb1b6a0c32bab59c294b2ff905481c0a3667d17974c7f62ba8a5d646e11f8977baea5847a5defd57147cb5f1c3fc4b83213d3890ea17a61c9380aa40c826826c95b168ac97d68df98b704df693c4ac83b677ade6db93d0ccec14454b515c296415c447c0dd7961e4ed1a7715e43a5da0577d6c2fbd28684b078b50f130176f8c8d52555b7c10795f2707da0d95572a1b8faeb5235ec4974cf82ad5fedf17c8aa17",
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

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});