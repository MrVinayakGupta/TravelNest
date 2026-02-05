if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");

const path = require("path"); 
const app = express(); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretkey",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {  
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//Database Connection

main().then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log("'error occured' We did not connect to db ");
});

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/AirbnbReplica')
    .then(() => {
        console.log("We connected to mongo db");
    })
    .catch((err) => {
        console.log(err);
    });
}


app.use("/", listing);
// app.use("/:id/reviews", review);
app.use("/", user);

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//Reviews
//Post route for reviews
app.post("/:id/reviews", validateReview, wrapAsync ( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    await newReview.save();

    // push reference to review
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/${listing._id}`);
}));

//Delete route for reviews
app.delete("/:id/reviews/:reviewId", wrapAsync( async (req, res) => {
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/${id}`);
}));


//Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});


app.listen(5050, () => {
    console.log("Server is running on port 5050");
});