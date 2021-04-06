const mongoose = require('mongoose');
const CampGround = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');
const cities = require("./cities")

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
})

const randomNumberGenerator = function(num1, num2, decimal){
    if(decimal){
        return ((Math.random()*num2 + num1)).toFixed(2);
    }
    return Math.floor(Math.random()*num2) + num1
}

const seedDB = async()=>{
    await CampGround.deleteMany({});

    for(let i = 0; i < 50; i ++){
        const randomDescriptor = descriptors[randomNumberGenerator(0,descriptors.length, false)];
        const randomPlaces = places[randomNumberGenerator(0,places.length, false)];
        const randomPrice = randomNumberGenerator(0,100,true);
        const randomNum = randomNumberGenerator(0,1000,false)
        const randomCity = cities[randomNum].city;
        const randomState = cities[randomNum].state
        const c = new CampGround({title:`${randomDescriptor} ${randomPlaces}`, price:randomPrice, location:`${randomCity}, ${randomState}` })
        await c.save();
    }

}

seedDB();