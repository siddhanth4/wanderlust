const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
       res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Authorization of Owner
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
        if (!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error", "YOU ARE NOT THE OWNER");
            return res.redirect(`/listings/${id}`);
        }
        next();
};

// Validation of Listing
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Validation of Review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    const {rating} = req.body.review;
    console.log(error);
    if (!error ) {
        next();
    } else {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
        return res.redirect(`/listings/${id}`);


    }
};

//Authorization of Author of Review
module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
        if (!review.author.equals(res.locals.currUser._id)){
            req.flash("error", "YOU ARE NOT THE AUTHOR OF THIS REVIEW");
            return res.redirect(`/listings/${id}`);
        }
        next();
};