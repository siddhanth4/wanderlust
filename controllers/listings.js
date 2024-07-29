const { model } = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index =  async (req,res) => {
    const allListings = await  Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
    console.log("working");
};

module.exports.showListing = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");
    if(!listing){
        req.flash("error", "LISTING DOES NOT EXIST");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();
    
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "NEW LISTING CREATED!");
    res.redirect("/listings"); 
};

module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "LISTING DOES NOT EXIST");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", {listing });
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing},  { new: true });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
        await updatedListing.save();
    }
    

    console.log(updatedListing);
    req.flash("success", "LISTING UPDATED!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "LISTING DELETED!");

    res.redirect("/listings");
};