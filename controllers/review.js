const Review = require("../models/review.js");

module.exports.DeleteReview = async (req, res) => {
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/${id}`);
}

module.exports.CreateReview = async (req, res) => {
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
}