// const {index,renderNewForm, showProduct, addProduct, editForm, updateProduct,destroyProduct} = ("../controllers/products.js");
const Product = require("../models/products.js");

const VALID_CATEGORIES = [
    "Books & Stationery",
    "Clothing",
    "Home & Kitchen",
    "Mobiles & Accessories",
    "Healthcare",
    "Groceries",
    "Furniture",
    "Plastic Items"
];


//Home Page
module.exports.index = async (req, res) => {
    const { category, q } = req.query;
    let filter = {};

    if (category && VALID_CATEGORIES.find(cat => cat === category)) {
        filter.category = category;
    }

    if (q && q.trim() !== "") {

        let searchCategory = VALID_CATEGORIES.find(cat => cat.toLowerCase() === q.trim().toLowerCase());
        if(searchCategory){
            filter.category = searchCategory;
        }else{
            filter.title = { $regex: q.trim(), $options: "i" };
        }
    }

    const allProducts = await Product.find(filter);
    res.render("products/index.ejs", {
        allProducts
    });
};


//Sell Item
module.exports.renderNewForm = (req,res)=>{
    res.render("products/add.ejs");
};

//Show Item
module.exports.showProduct = async(req,res) =>{
    let {id} = req.params;
    const product = await Product.findById(id)
        .populate({
            path: "reviews",
            populate: {path: "author"},  
        })
        .populate("owner");
    
    if(!product){
        req.flash("error", "Item requested does not exist");
        return res.redirect("/products");
    }
    res.render("products/show.ejs", {product});
};

//Sell Product 
module.exports.addProduct = async(req,res) =>{
    try{
        const { category } = req.body.product;
        const validCategory = VALID_CATEGORIES.find(cat => cat === category);

        if (!validCategory) {
            req.flash("error", "Invalid category selected.");
            return res.redirect("/products/add");
        }
        const newProduct = new Product(req.body.product);
        newProduct.owner = req.user._id;
        // Uploading Images
        if(req.files && req.files.images){
            req.files.images.forEach(file => {
                newProduct.image.push({
                    filename: file.filename,
                    url: file.path
                });
            })
        }
        await newProduct.save();
        req.flash("success", "New Listing Created");
        res.redirect(`/products/${newProduct._id}`);
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/products/add");
    }
};

//Edit Product
module.exports.editForm = async (req,res) =>{
    let { id } = req.params;
    const product = await Product.findById(id).populate("owner");
    res.render("products/edit.ejs", {product});
};

//Update Product
module.exports.updateProduct = async(req,res) =>{
    try{
        let { id } = req.params;

        const { category } = req.body.product;
        const validCategory = VALID_CATEGORIES.find(cat => cat === category);
        if (!validCategory) {
            req.flash("error", "Invalid category selected.");
            return res.redirect(`/products/${id}/edit`);
        }

        await Product.findByIdAndUpdate(id, { ...req.body.product });
        req.flash("success", "Item Updated");
        res.redirect(`/products/${id}`);
    }catch(err){
        req.flash("error", err.message);
        res.redirect(`/products/${id}/edit`);
    }
    
};

//Delete Product 
module.exports.destroyProduct = async (req,res) =>{
    let {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    console.log(deletedProduct);
    req.flash("success", "Item Deleted from EliteMart");
    res.redirect("/products");
};

//Add to Cart
