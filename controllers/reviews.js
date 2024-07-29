const { model } = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const {id} = req.params;
    const {comment, rating} = req.body.review;
    let listing = await Listing.findById(id);
    const newReview = new Review({comment, rating});

    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review is Saved");
    req.flash("success", "NEW REVIEW CREATED!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "REVIEW DELETED!");
    res.redirect(`/listings/${id}`);
};