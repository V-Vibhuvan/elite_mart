if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


// ignore ALL Chrome DevTools .well-known requests
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/.well-known')) {
    console.log("IGNORED WELL-KNOWN REQUEST:", req.originalUrl);
    return res.sendStatus(204);
  }
  next();
});


const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL;

app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


const products = require("./routes/products.js");
const review = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cart = require("./routes/cart.js");
const orders = require("./routes/orders.js");
const seller = require("./routes/seller.js");

const cookieParser = require("cookie-parser");

// --- Connect to MongoDB ---
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// --- Middleware setup ---
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
  console.log("Error in mongo session store", err);
})

// Session configuration
const sessionConfig = {
    store,
    secret: "somethingRandomSecret",
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000* 60 * 60 * 24 * 3,
        httpOnly : true
    },
};


app.use(session(sessionConfig));
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set template locals for flash + current user
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    res.locals.query = req.query;
    next();
});


const ExpressError = require("./utils/ExpressError.js");

// --- Routes ---
app.use("/products", products);
app.use("/products/:id/reviews", review);
app.use("/", userRouter);
app.use("/cart", cart);
app.use("/orders", orders);
app.use("/seller", seller);



app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});




//Global error handler (minimal)
app.use((err,req,res,next)=>{
    let {statusCode = 500 , message = "Something went wrong!" } = err;
    //let errMsg = error.details.map(el => el.message).join(",");
    res.status(statusCode).render("error.ejs", {err, message});
    //res.status(statusCode).send(message);
});

// TEMP - put near bottom of app.js (replace current handler while debugging)
// app.use((err, req, res, next) => {
//   console.error('GLOBAL ERR >>>', err);
//   res.status(err.statusCode || 500).send(`<pre>${err.stack || err.message}</pre>`);
// });


// Start server
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
