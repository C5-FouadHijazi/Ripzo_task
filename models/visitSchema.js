const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  time: { type: mongoose.Schema.Types.Number , default: Date.now },
});

module.exports = mongoose.model("Visits", userSchema);
