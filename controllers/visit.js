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

  let clients = await clientModel.aggregate([
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
  ]);

  let visits = cache.get(from, to, day);
  if (!visits) {
    visits = await visitModel.aggregate([
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
    "Zero visits": clients,
    "Less visits": visits,
  });
};

module.exports = {
  getLessVisitors,
};

/* 
I have these two aggregations, as shown below.
The first one returns the clients that have zero visits(no visit objects created for the client).
The second one returns the clients with less visits than the others(at least 5).

I want to combine these two aggregations results into one so that they will be ordered like this:

> [ no visits clients,
> 
> least visits clients ]

Is that possible without simply using Array concat method?
 
**I have these two aggregations:** 

     let clients = await clientModel.aggregate([
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
            numOfVisits: {
              $size: "$visits",
            },
          },
        },
        {
          $match: {
            numOfVisits: 0,
          },
        },
      ]);



 with this result :

   

     "clients": [
        {
            "_id": "6182ebe5ea218257521cdc36",
            "name": "cleint_807"
        },
        {
            "_id": "6182ebfaea218257521cdc9a",
            "name": "cleint_907"
        },
        {
            "_id": "6182ec02ea218257521cdcbe",
            "name": "cleint_943"
        },
        {
            "_id": "6182ec20ea218257521cdd48",
            "name": "cleint_71"
        },
        {
            "_id": "6182ec29ea218257521cdd74",
            "name": "cleint_115"
        },
        {
            "_id": "6182ec54ea218257521cde5a",
            "name": "cleint_345"
        },
        {
            "_id": "6182ec61ea218257521cdea3",
            "name": "cleint_418"
        },
        {
            "_id": "6182ec71ea218257521cdef4",
            "name": "cleint_499"
        },
        {
            "_id": "6182ec96ea218257521cdfbc",
            "name": "cleint_699"
        }
    ],
    

**Second aggregation:**

  

    let visits = cache.get(from, to, day);
      if (!visits) {
        visits = await visitModel.aggregate([
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
        }
    
with this result :
 

    "visits": [
            {
                "client": {
                    "_id": "6182ec53ea218257521cde57",
                    "name": "cleint_342"
                }
            },
            {
                "client": {
                    "_id": "6182ecc3ea218257521ce0ab",
                    "name": "cleint_938"
                }
            },
            {
                "client": {
                    "_id": "6182eb4aea218257521cd91f",
                    "name": "cleint_16"
                }
            },
            {
                "client": {
                    "_id": "6182eb53ea218257521cd94f",
                    "name": "cleint_64"
                }
            },
            {
                "client": {
                    "_id": "6182ecadea218257521ce036",
                    "name": "cleint_821"
                }
            },
            {
                "client": {
                    "_id": "6182eb92ea218257521cda96",
                    "name": "cleint_391"
                }
            },
            {
                "client": {
                    "_id": "6182ebbdea218257521cdb6f",
                    "name": "cleint_608"
                }
            },
            {
                "client": {
                    "_id": "6182ec54ea218257521cde5c",
                    "name": "cleint_347"
                }
            },
            {
                "client": {
                    "_id": "6182ec1fea218257521cdd42",
                    "name": "cleint_65"
                }
            },
            {
                "client": {
                    "_id": "6182ec90ea218257521cdf99",
                    "name": "cleint_664"
                }
            }
        ]
    
I need to combine both results to be one and the same shape */
