const express = require("express");

// Import Visit controllers
const { getLessVisitors } = require("../controllers/visit");

const visitRouter = express.Router();

visitRouter.get("/less-visited-clients-per-day", getLessVisitors);

module.exports = visitRouter;
