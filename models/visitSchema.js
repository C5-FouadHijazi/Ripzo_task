const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    clientid: { type: mongoose.Schema.Types.ObjectId, ref:"CLIENT" },
    userid:{ type: mongoose.Schema.Types.ObjectId, ref:"USER" },
    time: {}

});

module.exports = mongoose.model("VISIT", userSchema);
