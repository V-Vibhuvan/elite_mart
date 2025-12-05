const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSnapshotSchema = new Schema({
  fullName: String,
  phone: String,
  pincode: String,
  street: String,
  city: String,
  state: String,
  country: String,
  landmark: String
}, { _id: false });

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceSnapshot: Number,
  titleSnapshot: String,
  imageSnapshot: String,
  
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["Packed", "Shipped", "Delivered", "Cancelled"],
    default: "Packed"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  }
});

const orderSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: addressSnapshotSchema,
  orderedAt: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending"
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("Order", orderSchema);
