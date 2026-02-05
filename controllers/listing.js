const Listing = require("../models/listing.js");

module.exports.Home = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("ejs/home.ejs", { allListings });
};

module.exports.New = (req, res) => {
    res.render("ejs/new.ejs");
};


module.exports.Show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"},} ).populate("owner");
    
    if(!listing) {
        req.flash("error", "Cannot find that listing!");
        res.render("ejs/show.ejs", { listing, id });
    }
    res.render("ejs/show.ejs", { listing, id });
};

module.exports.Create = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };  
    console.log(req.body);
    console.log(newListing);
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/");
};

module.exports.Edit =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/");
    }
    res.render("ejs/edit.ejs", { id, listing });
};

module.exports.Update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }else{
        throw new ExpressError(400, "Send valid data for listing");
    }
   
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/");
};
