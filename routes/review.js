const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const { createReview, destroyReview } = require("../controllers/review.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");

// Post Review
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Review 
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview));

module.exports = router;
