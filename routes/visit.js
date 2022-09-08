const express = require("express");

// Import Visit controllers
 const { getAllVisitours ,getLessVisitors} = require("../controllers/visit"); 

// Middleware

// Create campaigns router
const visitRouter = express.Router();

visitRouter.get("/",getAllVisitours );

visitRouter.get("/less-visited-clients-per-day?from=id&to=id&day=id" ,getLessVisitors);




module.exports = visitRouter;
