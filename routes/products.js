const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


const { isLoggedIn, isProductOwner, validateProduct } = require("../middleware.js");

const { index, renderNewForm, showProduct, addProduct, editForm, updateProduct, destroyProduct } = require("../controllers/products.js");

//Index Route
router.get("/", wrapAsync(index));

//Sell Product (New Product)
router.get("/add", isLoggedIn, renderNewForm);

//Show Product
router.get("/:id", wrapAsync(showProduct));

//Sell Product
router.post("/",
    isLoggedIn,
    upload.fields([
        { name: "images", maxCount: 10 },
    ]),
    validateProduct,
    wrapAsync(addProduct)
);

//Update Route
router.get("/:id/edit",
    isLoggedIn,
    isProductOwner,
    wrapAsync(editForm)
);

router.put("/:id",
    isLoggedIn,
    isProductOwner,
    validateProduct,
    wrapAsync(updateProduct)
);

//Delete Route
router.delete("/:id",
    isLoggedIn,
    isProductOwner,
    wrapAsync(destroyProduct)
);

module.exports = router;
