const mongoose = require("mongoose");

var user = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

module.exports = user