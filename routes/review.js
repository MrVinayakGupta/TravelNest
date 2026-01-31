const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Reviews
//Post route for reviews
router.post("/:id/reviews", isLoggedIn, validateReview, wrapAsync (reviewController.CreateReview));

//Delete route for reviews
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.DeleteReview));

//Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});


module.exports = router;