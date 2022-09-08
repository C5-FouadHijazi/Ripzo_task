const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");

const app = express();
const PORT = 3050;


// Import Routers
const clinetRouter = require("./routes/client");
const userRouter = require("./routes/users");
const visitRouter = require("./routes/visit");


app.use(cors());
app.use(express.json());

// Routes Middleware
 app.use("/client", clinetRouter);
app.use("/user", userRouter);
app.use("/visit", visitRouter);

// Handles any other endpoints [unassigned - endpoints]
app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});