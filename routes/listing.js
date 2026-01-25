const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const {isloggedIn} = require("../middleware.js"); 

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//error route
router.get("/random", (req, res) => {
    res.render("ejs/err.ejs");
    // throw new Error("This is a forced error.");
});

// Home Route
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("ejs/home.ejs", { allListings });
}));

//New Route
router.get("/new",  (req, res) => {
    res.render("ejs/new.ejs");
});

router.get('/favicon.ico', (req, res) => res.status(204).end());

//Show Route
router.get("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    
    if(!listing) {
        req.flash("error", "Cannot find that listing!");
        res.render("ejs/show.ejs", { listing, id });
    }
    res.render("ejs/show.ejs", { listing, id });
}));

//Create Route
router.post("/", validateListing, wrapAsync( async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    console.log(req.body);
    console.log(newListing);
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/");
}));

// Edit Route
router.get("/:id/edit", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("ejs/edit.ejs", { id, listing });
}));

//Update Route
router.put("/:id",  validateListing, wrapAsync( async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/${id}`);
}));

//Delete Route
router.delete("/:id",  wrapAsync( async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/");
}));

//Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});

module.exports = router;