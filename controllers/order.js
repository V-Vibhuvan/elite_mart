const Order = require("../models/orders");
const Cart = require("../models/cart");
const User = require("../models/user");

module.exports.index = async (req, res) => {
    const orders = await Order.find({ buyer: req.user._id }).populate("items.product");
    res.render("orders/index.ejs", { orders });
};


module.exports.show = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
        req.flash("error", "Order not found");
        return res.redirect("/orders");
    }
    res.render("orders/show.ejs", { order });
};

module.exports.create = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
        req.flash("error", "Your cart is empty");
        return res.redirect("/cart");
        }

        if (user.addresses.length === 0) {
        req.flash("error", "Add an address before placing an order");
        return res.redirect("/profile");
        }

        const addr =
        user.addresses.id(user.defaultAddress) || user.addresses[0];

        const items = cart.items.map(ci => {
        const p = ci.product;
        return {
            product: p._id,
            quantity: ci.quantity,
            priceSnapshot: p.price,
            titleSnapshot: p.title,
            imageSnapshot: p.image[0].url,
            seller: p.owner,
            status: "Packed"
        };
        });

        const order = new Order({
        buyer: req.user._id,
        items,
        shippingAddress: {
            fullName: addr.fullName,
            phone: addr.phone,
            pincode: addr.pincode,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            landmark: addr.landmark
        }
        });

        await order.save();
        cart.items = [];
        await cart.save();

        req.flash("success", "Order placed successfully");
        res.redirect(`/orders/${order._id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.updateStatus = async (req, res, next) => {
    try {
        const { orderId, itemId } = req.params;
        const { order } = req.body;

        const ord = await Order.findById(orderId);
        if (!ord) {
        req.flash("error", "Order not found");
        return res.redirect("/orders");
        }

        const item = ord.items.id(itemId);
        if (!item) {
        req.flash("error", "Order item not found");
        return res.redirect(`/orders/${orderId}`);
        }

        item.status = order.status;
        await ord.save();

        req.flash("success", "Order status updated");
        res.redirect(`/orders/${orderId}`);
    } catch (err) {
        next(err);
    }
    };

    module.exports.destroyOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const ord = await Order.findById(orderId);

        if (!ord) {
        req.flash("error", "Order not found");
        return res.redirect("/orders");
        }

        const cannotCancel = ord.items.some(
        i => i.status === "Shipped" || i.status === "Delivered"
        );

        if (cannotCancel) {
        req.flash("error", "You cannot cancel an already shipped/delivered order");
        return res.redirect(`/orders/${orderId}`);
        }

        ord.items.forEach(i => (i.status = "Cancelled"));
        await ord.save();

        req.flash("success", "Order cancelled");
        res.redirect("/orders");
    } catch (err) {
        next(err);
    }
};
