const express = require("express");
const router = express.Router();
const sellerCtrl = require("../controllers/seller.js");
const { isLoggedIn } = require("../middleware.js");

// View all sold items
router.get("/soldItems", isLoggedIn, sellerCtrl.showSoldItems);

// Update payment status of an item
router.put(
    "/soldItems/:orderId/items/:itemIndex/payment",
    isLoggedIn,
    sellerCtrl.updatePayment
);

// Update order status of an item
router.put(
    "/soldItems/:orderId/items/:itemIndex/status",
    isLoggedIn,
    sellerCtrl.updateStatus
);

module.exports = router;
