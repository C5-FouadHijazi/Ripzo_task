const visitModel = require("../models/visitSchema");


const getLessVisitors = async (req, res) => {
  const { from, to, day } = req.query;
  const visits = await visitModel.find({ time: { $lte: +to , $gte: +from } })
  .populate("client")
  res.json({
    success: true,
    visits 
  });
}

module.exports = {
  getLessVisitors,
};
