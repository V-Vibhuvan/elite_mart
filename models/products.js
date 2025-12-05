const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: [{
        filename: {
            type: String,
            default: "productImage",
            set: (v) => (v === "" ? "productImage" : v),
        },
        url: {
            type: String,
            set: (v) =>
                v === ""
                    ? "https://images.unsplash.com/photo-1758797849614-aea4f74fb056?q=80&w=685&auto=format&fit=crop"
                    : v,
        }
    }],

    category: {
        type: String,
        required: true,
        enum: [
            "Books & Stationery",
            "Clothing",
            "Home & Kitchen",
            "Mobiles & Accessories",
            "Healthcare",
            "Groceries",
            "Furniture",
            "Plastic Items"
        ]
    },
    price: Number,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

module.exports = mongoose.model("Product", productSchema);
