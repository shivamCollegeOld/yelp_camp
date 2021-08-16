if(process.env.NODE !=="production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');
const dbUrl = process.env.DB_URL;
// local db: 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
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
            const sampleLocation = giveSample(cities);
            const newCamp = new Campground({
                title: `${giveSample(places)} ${giveSample(descriptors)}`,
                location: `${sampleLocation.city}, ${sampleLocation.state}`,
                price: Math.floor(Math.random()*100)+1,
                description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, ipsum. Nostrum, suscipit vel quisquam sapiente, deleniti omnis eligendi nemo magnam facilis voluptates porro ducimus eum molestias, alias nesciunt incidunt consectetur.",
                author: '611a133090eb1b9b49779867',
                images: [
                    {
                      url: 'https://res.cloudinary.com/yelp-camp-zeproffesor/image/upload/v1629037523/Yelp-Camp/mfeygmfndkfgxjifc0rp.jpg',
                      filename: 'Yelp-Camp/mfeygmfndkfgxjifc0rp',
                    },
                    {
                      url: 'https://res.cloudinary.com/yelp-camp-zeproffesor/image/upload/v1629037524/Yelp-Camp/qvfu0amtkf9lip2tpqvd.jpg',
                      filename: 'Yelp-Camp/qvfu0amtkf9lip2tpqvd',
                    },
                    {
                      url: 'https://res.cloudinary.com/yelp-camp-zeproffesor/image/upload/v1629037527/Yelp-Camp/sx7nqnqtiqwhxj68risb.jpg',
                      filename: 'Yelp-Camp/sx7nqnqtiqwhxj68risb',
                    },
                ],
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