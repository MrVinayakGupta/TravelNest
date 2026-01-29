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
            url: String,
            filename: String,
        },
        default: {
            url: "https://images.pexels.com/photos/9407824/pexels-photo-9407824.jpeg",
            filename: "img.png",
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
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews, } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;