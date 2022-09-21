const visitModel = require("../models/visitSchema");
const clientModel = require("../models/clientSchema");
const cache = require("../cache");

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

  let clients = cache.get(from, to, day);
  if (!clients) {
    clients = await clientModel.aggregate([
      {
        $lookup: {
          from: "visits",
          localField: "_id",
          foreignField: "client",
          as: "visits",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          count: {
            $size: "$visits",
          },
        },
      },
      {
        $match: {
          count: 0,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
      {
        $unionWith: {
          coll: "visits",
          pipeline: [
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
                _id: "$client._id",
                name: "$client.name",
              },
            },
          ],
        },
      },
    ]);
    cache.set(from, to, day, clients);
  }

  let visits = cache.get(from, to, day);
  if (!visits) {
    visits = await visitModel.aggregate([
      {
        $match: {
          time: { $lte: +to, $gte: +from },
        },
      },
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
          day: 2,
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
          _id: "$client._id",
          name: "$client.name",
        },
      },
    ]);
    cache.set(from, to, day, visits);
  }

  res.json({
    success: true,
    clients,
  });
};

module.exports = {
  getLessVisitors,
};
