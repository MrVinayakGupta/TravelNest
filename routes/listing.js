const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); 

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const User = require("../models/user.js"); // Make sure this path matches your folder structure!


const listingController = require("../controllers/listing.js");

//error route
router.get("/random", (req, res) => {
    res.render("ejs/err.ejs");
    // throw new Error("This is a forced error.");
});

// Search Route
router.get("/api/search", async (req, res) => {
    //try {
        const { q } = req.query;

        const results = await Listing.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } } // Calculate relevance
        ).sort({ score: { $meta: "textScore" } }); // Sort by best match

        res.render("ejs/searchResult.ejs", { results, query: q });
    // } catch (err) {
    //     console.error("Search Error:", err);
    //     res.status(500).render("ejs/err.ejs", { message: "Search failed." });
    // }
});
// router.get("/api/search", wrapAsync( async (req, res) => {
//     let { q } = req.query;
//     let listings = await Listing.find({ location: new RegExp(q, 'i') });
//     res.json(listings);
// }));

// Home Route
router.get("/", wrapAsync(listingController.Home));

//New Route
router.get("/new", isLoggedIn, listingController.New);

router.get('/favicon.ico', (req, res) => res.status(204).end());

//Show Route
router.get("/:id", wrapAsync(listingController.Show));

//Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.Create));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.Edit));

//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync( listingController.Update));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));


//Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});

module.exports = router;