// showCart , addItem, updateItem , destroyItem
const Cart = require("../models/cart.js");
const Product = require("../models/products.js");

module.exports.showCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product")
    .populate("items.seller");
  if (!cart) cart = { items: [] };
  res.render("cart/index.ejs", { cart });
};

module.exports.addItem = async (req, res) => {
  let { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    req.flash("error", "Product Not Found");
    return res.redirect("/products");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existing = cart.items.find(item => item.product.equals(product._id));
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({
      product: product._id,
      quantity: 1,
      priceSnapshot: product.price,
      titleSnapshot: product.title,
      imageSnapshot: product.image[0].url,
      seller: product.owner
    });
  }

  await cart.save();
  req.flash("success", "Added to Cart");
  res.redirect("/cart");
};

// Update Item
module.exports.updateItem = async (req, res) => {
  const { itemId } = req.params;
  // parse quantity as integer
  const qty = parseInt(req.body.quantity, 10);

  if (!Number.isInteger(qty) || qty <= 0) {
    req.flash("error", "Quantity must be at least 1");
    return res.redirect("/cart");
  }

  // find the cart for the current user
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    req.flash("error", "Cart Not Found");
    return res.redirect("/cart");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    req.flash("error", "Item not found in cart");
    return res.redirect("/cart");
  }

  item.quantity = qty;
  await cart.save();
  req.flash("success", "Cart updated");
  res.redirect("/cart");
};

module.exports.destroyItem = async (req, res) => {
  const { itemId } = req.params;
  // find the cart for the current user
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    req.flash("error", "Cart not found");
    return res.redirect("/cart");
  }

  const exists = cart.items.some(i => String(i._id) === String(itemId));
  if (!exists) {
    req.flash("error", "Item not found in cart");
    return res.redirect("/cart");
  }

  cart.items = cart.items.filter(i => String(i._id) !== String(itemId));
  await cart.save();

  req.flash("success", "Cart updated");
  res.redirect("/cart");
};
