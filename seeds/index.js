const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: '61d2c39d5fcf371506127711',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi laborum, ab obcaecati cumque inventore dicta libero corrupti voluptatibus quibusdam neque perspiciatis odio ratione similique nemo minus ut culpa accusantium accusamus.',
            geometry: {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
                },
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/drfknwvhu/image/upload/v1641380283/YelpCamp/djhpjqgzaumjny7vr93o.jpg',
                  filename: 'YelpCamp/djhpjqgzaumjny7vr93o'
                },
                {
                  url: 'https://res.cloudinary.com/drfknwvhu/image/upload/v1641286008/YelpCamp/aw79jecfyk3nb1ffwixk.jpg',
                  filename: 'YelpCamp/aw79jecfyk3nb1ffwixk'
                }
            ]
        });
        await camp.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
});