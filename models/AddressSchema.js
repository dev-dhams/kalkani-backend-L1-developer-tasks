const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    line_1: {
        type: String,
        required: true,
    },
    line_2: {
        type: String,
    },
    pincode: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    type:{
        type: String, 
    },
});

module.exports = Address = mongoose.model("Address", AddressSchema);
