const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ordersCtrl = require("../controllers/order");

const { 
    isLoggedIn, 
    isOrderOwner, 
    validateOrder,
    isSellerOfOrderItem
} = require("../middleware.js");

//Ordered Items (list of buyer's orders)
router.get("/", 
    isLoggedIn, 
    wrapAsync(ordersCtrl.index)
);

//Single Order (buyer only)
router.get("/:orderId", 
    isLoggedIn, 
    isOrderOwner, 
    wrapAsync(ordersCtrl.show)
);

//Create Order (from cart)
router.post("/create", 
    isLoggedIn, 
    wrapAsync(ordersCtrl.create)
);

//Update Status (seller only)
router.put("/:orderId/item/:itemId/status", 
    isLoggedIn, 
    isSellerOfOrderItem, 
    validateOrder,
    wrapAsync(ordersCtrl.updateStatus)
);

//Cancel order (buyer)
router.delete("/:orderId", 
    isLoggedIn, 
    isOrderOwner, 
    wrapAsync(ordersCtrl.destroyOrder)
);

module.exports = router;
