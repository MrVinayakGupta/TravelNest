const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/user/singup", (req, res) => {
    res.render("ejs/singup.ejs");
});

router.post("/user/singup", wrapAsync( async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ username, email });
        const registeredUser = await user.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
        });
        req.flash("success", "Welcome to TravelNest!");
        res.redirect("/");
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/singup");
    }
}));

router.get("/user/login", (req, res) => {
    res.render("ejs/login.ejs");
});

router.post("/user/login", passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), async (req, res, next) => {
    req.flash("success", `Welcome back! ${req.user.username}`);
    res.redirect("/");
});

router.get("/user/logout", (req, res, next) => {
    req.logout( (err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out successfully!");
        res.redirect("/");
    });
});

module.exports = router;