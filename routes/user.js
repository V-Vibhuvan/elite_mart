const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const userCtrl = require("../controllers/user");

const {
  isLoggedIn,
  saveRedirectUrl
} = require("../middleware.js");

router.get("/signup", saveRedirectUrl, userCtrl.renderSignup);
router.post("/signup", wrapAsync(userCtrl.signup));

router.get("/login", saveRedirectUrl, userCtrl.renderLogin);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  wrapAsync(userCtrl.login)
);

router.get("/logout", isLoggedIn, userCtrl.logout);

router.get("/profile", isLoggedIn, wrapAsync(userCtrl.profile));
router.put("/profile", isLoggedIn, wrapAsync(userCtrl.updateProfile));

router.get("/addresses/new", isLoggedIn, wrapAsync(userCtrl.renderAddAddress));
router.post("/addresses", isLoggedIn, wrapAsync(userCtrl.addAddress));

router.get("/addresses/:addrId/edit", isLoggedIn, wrapAsync(userCtrl.renderEditAddress));
router.put("/addresses/:addrId", isLoggedIn, wrapAsync(userCtrl.editAddress));

router.delete("/addresses/:addrId", isLoggedIn, wrapAsync(userCtrl.deleteAddress));
router.put("/addresses/:addrId/default", isLoggedIn, wrapAsync(userCtrl.setDefaultAddress));

module.exports = router;
