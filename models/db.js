const mongoose = require("mongoose");

// connecting to mongodb
mongoose.connect(process.env.DB_URI).then(
  () => {
    console.log("DB Ready To Use");
    require("./clientSchema")
    require("./userSchema")
    require("./visitSchema")
  },
  (err) => {
    console.log(err);
  }
);
