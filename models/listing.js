const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: false,
    },
    description: String,
     image: { 
        type : {
            filename: String,
            url: String,
        },
        default : {
            filename: "img.png",
            url: "https://images.pexels.com/photos/9407824/pexels-photo-9407824.jpeg",
        // set: (v) => v === "" ? "https://images.pexels.com/photos/9407824/pexels-photo-9407824.jpeg" : v ,
        } 
    },
    price: Number,
    location: String,
    country: String,
    review : {
        type : Schema.Types.ObjectId,
        ref : "Review",
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;