const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    fullName: String,
    phone: String,
    pincode: String,
    street: String,
    city: String,
    state: String,
    country: {
        type: String,
        default: "India"
    },
    landmark: String,
    isDefault: {
        type: Boolean,
        default: false
    }
});

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    addresses: [addressSchema],
    defaultAddress: {
        type: Schema.Types.ObjectId
    },
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
