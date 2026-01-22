const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const Listing = require("../models/listing.js");

router.get("/singup", (req, res) => {
    res.render("ejs/singup.ejs");
});

module.exports = router;