const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "CLIENT" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "USER" },
  time: { type: mongoose.Schema.Types.Number , default: Date.now },
});

module.exports = mongoose.model("VISIT", userSchema);
