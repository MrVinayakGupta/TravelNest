const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: {
            filename: String,
            url: String,
        },
        default: {
            filename: "img.png",
            url: "https://images.pexels.com/photos/9407824/pexels-photo-9407824.jpeg",
            // set: (v) => v === "" ? "https://images.pexels.com/photos/9407824/pexels-photo-9407824.jpeg" : v ,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews, } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;