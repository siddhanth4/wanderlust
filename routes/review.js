const express = require("express");
const router = express.Router({mergParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//REVIEWS
// Post route
router.post("/listings/:id/reviews", isLoggedIn, validateReview, wrapAsync (reviewController.createReview ));

//Delete Route
router.delete("/listings/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview)); 

module.exports = router;