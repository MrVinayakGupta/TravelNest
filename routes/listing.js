const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); 

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


const listingController = require("../controllers/listing.js");

//error route
router.get("/random", (req, res) => {
    res.render("ejs/err.ejs");
    // throw new Error("This is a forced error.");
});

// Home Route
router.get("/", wrapAsync(listingController.Home));

//New Route
router.get("/new", isLoggedIn, listingController.New);

router.get('/favicon.ico', (req, res) => res.status(204).end());

//Show Route
router.get("/:id", wrapAsync(listingController.Show));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.Create));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.Edit));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( listingController.Update));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

//Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});

module.exports = router;