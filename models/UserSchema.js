const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true
    },
    birth_date: {
        type: Date,
    },
    addresses: [],
});

module.exports = User = mongoose.model("User", UserSchema);
