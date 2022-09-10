const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  time: { type: mongoose.Schema.Types.Number , default: Date.now },
});

module.exports = mongoose.model("Visit", userSchema);
