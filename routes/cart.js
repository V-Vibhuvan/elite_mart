const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const cartCtrl = require("../controllers/cart");
const { isLoggedIn, isCartItemOwner, validateCart } = require("../middleware.js");

//Display Items in Cart
router.get("/", 
    isLoggedIn, 
    wrapAsync(cartCtrl.showCart)
);

//Add Product as Item to Cart
router.post("/add/:productId", 
    isLoggedIn, 
    wrapAsync(cartCtrl.addItem)
);

//Update Item in Cart
router.put("/item/:itemId", 
    isLoggedIn, 
    isCartItemOwner, 
    validateCart, 
    wrapAsync(cartCtrl.updateItem)
);

//Delete Item from Cart
router.delete("/item/:itemId", 
    isLoggedIn, 
    isCartItemOwner, 
    wrapAsync(cartCtrl.destroyItem)
);

module.exports = router;
