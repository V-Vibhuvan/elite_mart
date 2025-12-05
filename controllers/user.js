const User = require("../models/user");
const Order = require("../models/orders");
const ExpressError = require("../utils/ExpressError");

module.exports.renderSignup = (req,res) =>{
    return res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log('registeredUser:', registeredUser && registeredUser._id?.toString());

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Wanderlust');
      return res.redirect('/products');
    });
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/signup');
  }
};


module.exports.renderLogin = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) =>{
  try{
    req.flash("success", "Welcome Back!!!");
    let redirectUrl = res.locals.redirectUrl || "/products";
    res.redirect(redirectUrl);
  }catch(err){
    console.log(err);
  }
};

module.exports.logout = (req,res,next)=>{
    try{
      req.logOut((err) =>{
          if(err) {
              return next(err);
          }
          req.flash("success", "You are logged out!");
          res.redirect("/login");
      });
    }catch(err){
      console.log(err);
    }
};

// profile view
module.exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return next(new ExpressError("User not found", 404));
    res.render("users/profile.ejs", { user });
  } catch (err) {
    next(err);
  }
};

// update basic profile (username, email, phone)
module.exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return next(new ExpressError("User not found", 404));
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();
    req.flash("success", "Profile updated");
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

// render add address page
module.exports.renderAddAddress = async (req, res) => {
  res.render("users/addresses/new.ejs");
};

// add address
module.exports.addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, pincode, street, city, state, country, landmark, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return next(new ExpressError("User not found", 404));
    const addr = { fullName, phone, pincode, street, city, state, country, landmark, isDefault: !!isDefault };
    user.addresses.push(addr);
    if (user.addresses.length === 1 || isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      const last = user.addresses[user.addresses.length - 1];
      last.isDefault = true;
      user.defaultAddress = last._id;
    }
    await user.save();
    req.flash("success", "Address added");
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

// render edit address page
module.exports.renderEditAddress = async (req, res, next) => {
  try {
    const { addrId } = req.params;
    const user = await User.findById(req.user._id).lean();
    if (!user) return next(new ExpressError("User not found", 404));
    const address = (user.addresses || []).find(a => String(a._id) === String(addrId));
    if (!address) return next(new ExpressError("Address not found", 404));
    res.render("users/addresses/edit.ejs", { address });
  } catch (err) {
    next(err);
  }
};

// edit address
module.exports.editAddress = async (req, res, next) => {
  try {
    const { addrId } = req.params;
    const { fullName, phone, pincode, street, city, state, country, landmark, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return next(new ExpressError("User not found", 404));
    const address = user.addresses.id(addrId);
    if (!address) return next(new ExpressError("Address not found", 404));
    address.fullName = fullName;
    address.phone = phone;
    address.pincode = pincode;
    address.street = street;
    address.city = city;
    address.state = state;
    address.country = country;
    address.landmark = landmark;
    if (isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      address.isDefault = true;
      user.defaultAddress = address._id;
    }
    await user.save();
    req.flash("success", "Address updated");
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

// delete address
module.exports.deleteAddress = async (req, res, next) => {
  try {
    const { addrId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return next(new ExpressError("User not found", 404));

    const address = user.addresses.id(addrId);
    if (!address) return next(new ExpressError("Address not found", 404));

    const wasDefault = address.isDefault;

    user.addresses = user.addresses.filter(a => String(a._id) !== String(addrId));

    if (wasDefault) {
      if (user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
        user.defaultAddress = user.addresses[0]._id;
      } else {
        user.defaultAddress = undefined;
      }
    }

    await user.save();
    req.flash("success", "Address removed");
    res.redirect("/profile");

  } catch (err) {
    next(err);
  }
};


// set default address
module.exports.setDefaultAddress = async (req, res, next) => {
  try {
    const { addrId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return next(new ExpressError("User not found", 404));
    const address = user.addresses.id(addrId);
    if (!address) return next(new ExpressError("Address not found", 404));
    user.addresses.forEach(a => a.isDefault = false);
    address.isDefault = true;
    user.defaultAddress = address._id;
    await user.save();
    req.flash("success", "Default address set");
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};
