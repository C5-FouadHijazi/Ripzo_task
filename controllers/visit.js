const visitModel = require("../models/visitSchema");

const getLessVisitors = (req, res) => {
  const { from, to, day } = req.query;
  res.json({ success: true });
};

module.exports = {
  getLessVisitors,
};
