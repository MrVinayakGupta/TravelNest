const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl, isLoggedIn} = require("../middleware.js");  

const userController = require("../controllers/user.js");


router.get("/user/singup", userController.singupGet);

router.post("/user/singup", wrapAsync(userController.singupPost));

router.get("/user/login", userController.loginGet);

router.post("/user/login", saveRedirectUrl,  passport.authenticate("local",{failureRedirect: "/user/login", failureFlash: true}), userController.loginPost);

router.get("/user/logout", userController.logoutGet);

// Wishlist Route
router.post("/user/wishlist/:id/toggle", isLoggedIn, wrapAsync(userController.toggleWishlist));

router.post("/user/wishlist/:id", isLoggedIn, wrapAsync( async (req, res) => {
    let { listingId } = req.body.id;
    let user = await User.findById(req.user._id);
    if (!user.wishlist.includes(listingId)) {
        user.wishlist.push(listingId);
        await user.save();
    }
    res.redirect("/user/wishlist");
}));


module.exports = router;