const Joi = require("joi");

const productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(""),
        price: Joi.number().min(0).required(),
        category: Joi.string().valid(
            "Books & Stationery",
            "Clothing",
            "Home & Kitchen",
            "Mobiles & Accessories",
            "Healthcare",
            "Groceries",
            "Furniture",
            "Plastic Items"
        ).required(),
        image: Joi.object({
            filename: Joi.string().allow("").default("productImage"),
            url: Joi.string().allow("").default("https://images.unsplash.com/photo-1758797849614-aea4f74fb056?q=80&w=685&auto=format&fit=crop")
        }).optional(),

    }).required()
});


const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comment: Joi.string().allow(""),
    }).required(),
});

const cartSchema = Joi.object({
    quantity: Joi.number().min(1).required()
});


const orderSchema = Joi.object({
    order: Joi.object({
        status : Joi.string()
            .valid("Packed", "Shipped", "Delivered", "Cancelled")
            .required()
    }).required()
});


module.exports = {productSchema, reviewSchema, cartSchema, orderSchema};