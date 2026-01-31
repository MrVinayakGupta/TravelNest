const User = require("../models/user.js");  

module.exports.singupGet = (req, res) => {
    res.render("ejs/singup.ejs");
}

module.exports.singupPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
        });
        req.flash("success", "Welcome to TravelNest!");
        res.redirect("/");
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/singup");
    }
};

module.exports.loginGet = (req, res) => {
    res.render("ejs/login.ejs");
};

module.exports.loginPost = async (req, res) => {
    req.flash("success", `Welcome back! ${req.user.username}`);
    res.redirect(res.locals.redirectUrl || "/"  );
};

module.exports.logoutGet = (req, res) => {
    req.logout( (err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out successfully!");
        res.redirect("/");
    });
};