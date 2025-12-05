const Product = require("./models/products.js");
const Review = require("./models/review.js");
const Cart = require("./models/cart.js");
const Order = require("./models/orders.js");

const ExpressError = require("./utils/ExpressError.js");
const { productSchema, reviewSchema, cartSchema, orderSchema } = require("./schema.js");

//Authentication
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to shop");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//Authorization
module.exports.isProductOwner = async (req,res,next) =>{
    const {id} = req.params;
    let product = await Product.findById(id);
    if(!product){
        req.flash("error", "Product Not Found");
        return res.redirect("/products");
    }
    if(!product.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to modify this product");
        return res.redirect(`/products/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req,res,next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);

    if(!review){
        req.flash("error", "Review Not Found");
        return res.redirect(`/products/${id}`);
    }

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You can't delete or modify someone else's review");
        return res.redirect(`/products/${id}`);
    }

    next();
};


module.exports.isCartItemOwner = async (req, res, next) => {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: res.locals.currUser._id });
    if (!cart) {
        req.flash("error", "Your cart is empty or not found");
        return res.redirect("/cart");
    }

    const item = cart.items.id(itemId);
    if (!item) {
        req.flash("error", "This item does not exist in your cart");
        return res.redirect("/cart");
    }
    next();
};


module.exports.isOrderOwner = async (req, res, next) => {
    const { orderId } = req.params;

    const order = await Order.findOne({
        _id: orderId,
        buyer: res.locals.currUser._id
    });

    if (!order) {
        req.flash("error", "Order not found or not accessible");
        return res.redirect("/orders");
    }

    next();
};

module.exports.isSeller = (req, res, next) => {
  const user = req.user || res.locals.currUser;
  
  if (!user || !user.isSeller) {
    req.flash("error", "Only seller can access this page");
    return res.redirect("/products");
  }
  next();
};


module.exports.isSellerOfOrderItem = async (req, res, next) => {
    const { orderId, itemId } = req.params;
    const userId = res.locals.currUser._id;

    const order = await Order.findById(orderId);

    if (!order) {
        req.flash("error", "Order not found");
        return res.redirect("/orders");
    }

    const item = order.items.id(itemId);

    if (!item) {
        req.flash("error", "Order item not found");
        return res.redirect(`/orders/${orderId}`);
    }

    if (!item.seller.equals(userId)) {
        req.flash("error", "You cannot update status for items you did not sell");
        return res.redirect(`/orders/${orderId}`);
    }

    next();
};

//Validations
module.exports.validateProduct = (req,res,next) =>{
    let {error} = productSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
};

module.exports.validateCart = (req,res,next) =>{
    let {error} = cartSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateOrder = (req,res,next) =>{
    let {error} = orderSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

