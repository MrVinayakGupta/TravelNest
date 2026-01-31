const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");  

const userController = require("../controllers/user.js");


router.get("/user/singup", userController.singupGet);

router.post("/user/singup", wrapAsync(userController.singupPost));

router.get("/user/login", userController.loginGet);

router.post("/user/login", saveRedirectUrl,  passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.loginPost);

router.get("/user/logout", userController.logoutGet);


module.exports = router;