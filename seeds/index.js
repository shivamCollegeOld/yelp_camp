const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

function giveSample(arr) {
    let n = arr.length;

    return arr[Math.floor(Math.random()*n)];
}

async function seedDB() {
    try {
        await Campground.deleteMany({});
        for(let i=0; i<50; ++i){
            console.log(`On ${i}th iteration`);
            const sampleLocation = giveSample(cities);
            const newCamp = new Campground({
                title: `${giveSample(places)} ${giveSample(descriptors)}`,
                location: `${sampleLocation.city}, ${sampleLocation.state}`,
                price: `${Math.floor(Math.random()*100)+1}`,
            });
            await newCamp.save();
        }

    } catch (err) {
        console.log("Something went wrong in the seeding!");
        console.log(err);
    }
}

seedDB()
    .then(() => {
        db.close();
    })
    .catch(() => {
        console.log("Error at the ending of seeding!");
    })