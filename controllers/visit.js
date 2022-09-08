const visitModel = require("../models/visitSchema");


// This function returns all visitours
const getAllVisitours = (req, res) => {
    visitModel
    .find({})
    .then((visit) => {
        console.log(visit);
      if (visit.length) {
        res.status(200).json({
          success: true,
          message: `All the Visitor`,
          visit: visit,
        });
      } else {
        res.status(200).json({
          success: false,
          message: `No visit Yet`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const getLessVisitors = (req,res) =>{
  const {from ,to ,day} = req.params;
  visitModel
    .find({ from : from , to : to ,day : day})
    .populate("visit")
    .then((result) => {
      console.log(result);
      if (result.length) {
        res.status(200).json({
          success: true,
          message: `All the situations`,
          situations: result[0].situation,
        });
      } else {
        res.status(200).json({
          success: false,
          message: `No Visitours Yet`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

}

module.exports = {
    getAllVisitours,
    getLessVisitors
  };
  