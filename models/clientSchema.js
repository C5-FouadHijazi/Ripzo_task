const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  firstName: { type: String  , required: true},
});

module.exports = mongoose.model("CLIENT", clientSchema);
