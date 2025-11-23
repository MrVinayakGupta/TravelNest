const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


const path = require("path");
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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


//Error 
app.get("/random", (req, res) => {
    res.render("ejs/err.ejs");
    // throw new Error("This is a forced error.");
});

// Home Route
app.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("ejs/home.ejs", { allListings });
}));

//New Route
app.get("/new", (req, res) => {
    res.render("ejs/new.ejs");
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
//Show Route
app.get("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("ejs/show.ejs", { listing, id });
}));

//Create Route
app.post("/", wrapAsync( async (req, res, next) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/");
}));

// Edit Route
app.get("/:id/edit", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("ejs/edit.ejs", { id, listing });
}));

//Update Route
app.put("/:id", wrapAsync( async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/${id}`);
}));

//Delete Route
app.delete("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/");
}));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});
app.listen(5050, () => {
    console.log("Server is running on port 5050");
});