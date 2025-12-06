const Order = require("../models/orders.js");

// Show sold items
module.exports.showSoldItems = async (req, res) => {
    try {
        const sellerId = String(req.user._id);

        const orders = await Order.find({ "items.seller": sellerId })
            .populate("buyer", "username email")
            .lean();

        // build sellerItems (each { item, index }) and attach to order as order.sellerItems
        for (let order of orders) {
            order.sellerItems = [];
            if (Array.isArray(order.items)) {
                order.items.forEach((it, idx) => {
                    if (String(it.seller) === sellerId) {
                        order.sellerItems.push({ item: it, index: idx });
                    }
                });
            }
        }

        res.render("seller/soldItems.ejs", { orders });
    } catch (err) {
        console.error("showSoldItems ERR:", err);
        req.flash("error", "Something went wrong while fetching sold items");
        return res.redirect("/products");
    }
};

module.exports.updatePayment = async (req, res) => {
    try {
        const { orderId, itemIndex } = req.params;
        // checkbox may not send anything when unchecked; default to "Pending"
        const paymentStatus = req.body.paymentStatus || req.body.paymentStatusDefault;

        const order = await Order.findById(orderId);

        if (!order || !order.items[itemIndex]) {
            req.flash("error", "Item not found!");
            return res.redirect("/profile");
        }

        const item = order.items[itemIndex];

        // Ownership check
        if (String(item.seller) !== String(req.user._id)) {
            req.flash("error", "Not allowed!");
            return res.redirect("/profile");
        }

        item.paymentStatus = paymentStatus;

        await order.save();

        req.flash("success", "Payment status updated!");
        res.redirect("/seller/soldItems");
    } catch (err) {
        console.error("updatePayment ERR:", err);
        req.flash("error", "Could not update payment status");
        return res.redirect("/profile");
    }
};

module.exports.updateStatus = async (req, res) => {
    try {
        const { orderId, itemIndex } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);

        if (!order || !order.items[itemIndex]) {
            req.flash("error", "Item not found!");
            return res.redirect("back");
        }

        const item = order.items[itemIndex];

        // Ownership check
        if (String(item.seller) !== String(req.user._id)) {
            req.flash("error", "Not allowed!");
            return res.redirect("back");
        }

        item.status = status;

        await order.save();

        req.flash("success", "Order status updated!");
        res.redirect("/seller/soldItems");
    } catch (err) {
        console.error("updateStatus ERR:", err);
        req.flash("error", "Could not update order status");
        return res.redirect("back");
    }
};
