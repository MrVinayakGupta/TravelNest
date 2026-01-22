const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

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

router.get("/login", (req, res) => {
    res.render("ejs/login.ejs");
});

router.post("/login", passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), async (req, res, next) => {
    req.flash("success", "Welcome back!");
    res.redirect("/");
});

module.exports = router;