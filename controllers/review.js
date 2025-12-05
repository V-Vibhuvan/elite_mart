// const {createReview, destroyReview} = require("../controllers/review.js");
const Review = require("../models/Review.js");
const Product = require("../models/products.js");

//Create a Review
module.exports.createReview = async (req, res) => {
    let product = await Product.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    product.reviews.push(newReview);

    await newReview.save();
    await product.save();
    req.flash("success", "New Review Created");

    res.redirect(`/products/${product._id}`);
};

module.exports.destroyReview = async (req,res) => {
    let {id, reviewId} = req.params;
    await Product.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/products/${id}`); 
};
