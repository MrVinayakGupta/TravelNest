const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


//Reviews
//Post route for reviews
router.post("/:id/reviews", isLoggedIn, validateReview, wrapAsync ( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview._id);
    
    await newReview.save();
    await listing.save();
    console.log(newReview);
    console.log(newReview._id);
    console.log(listing);
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/${listing._id}`);
}));

//Delete route for reviews
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync( async (req, res) => {
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/${id}`);
}));

//Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});


module.exports = router;