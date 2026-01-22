const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/singup", (req, res) => {
    res.render("ejs/singup.ejs");
});

router.post("/singup", wrapAsync( async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ username, email });
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to TravelNest!");
        res.redirect("/");
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/singup");
    }
}));

module.exports = router;