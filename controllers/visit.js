const visitModel = require("../models/visitSchema");

const getLessVisitors = async (req, res) => {
  const { from, to, day } = req.query;
  const daysMap = {
    sunday: 1,
    monday: 2,
    tuesday: 3,
    wednesday: 4,
    thursday: 5,
    friday: 6,
    saturday: 7,
  };
  const dayNumber = daysMap[day];

  const visits = await visitModel.aggregate([
    { $match: { time: { $lte: +to, $gte: +from } } },
    {
      $project: {
        date: {
          $toDate: "$time",
        },
        client: 1,
      },
    },
    {
      $project: {
        day: {
          $dayOfWeek: "$date",
        },
        client: 1,
      },
    },
    {
      $match: {
        day: dayNumber,
      },
    },
    {
      $group: {
        _id: {
          client: "$client",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: 1,
      },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "clients",
        localField: "_id.client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        _id: 0,
        client: 1,
      },
    },
  ]);
  res.json({
    success: true,
    visits,
  });
};



module.exports = {
  getLessVisitors,
};
