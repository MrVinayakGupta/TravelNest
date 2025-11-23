const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");


main().then(() =>{
    console.log("Connected to DATABASE");
})
.catch((err)=>{
    console.log("Error we did not connected to DATABASE");
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/AirbnbReplica");
};

const initDB = async() =>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data); //data.data in this .data is key value which come to data.js file
    console.log("Database Initialized");
};

initDB() //for calling function initDB which save data to database