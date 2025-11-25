const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//Reviews
//Post route for reviews
router.post("/:id/reviews", validateReview, wrapAsync ( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    await newReview.save();

    // push reference to review
    listing.reviews.push(newReview._id);
    await listing.save();

    res.redirect(`/${listing._id}`);
}));

//Delete route for reviews
router.delete("/:id/reviews/:reviewId", wrapAsync( async (req, res) => {
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/${id}`);
}));

//Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});


module.exports = router;