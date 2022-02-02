const { Admin, User } = require("../models");

exports.getUserByID = (req, res, next, id) =>
  Admin.findById(id, "_id name email", (e, admin) => {
    if (e) {
      console.log(e);
      return res
        .status(500)
        .json({ error: "Unable to fetch user from Database" });
    } else if (!admin) return res.status(400).json({ error: "User not found" });
    else req.profile = admin;
    next();
  });

exports.attendance = (req, res) => {
  const { hostel, rollNo, startDate, endDate } = req.body;
  const dateRange = { start: new Date(startDate), end: new Date(endDate) };
  const query = hostel ? { hostel: hostel } : { rollNo: rollNo };
  const queryOptions = hostel
    ? { project: { rollNo: 1 }, sort: { rollNo: 1 } }
    : { project: { hostel: 1 }, sort: { attendance: -1 } };

  User.aggregate(
    [
      {
        $match: {
          ...query,
          attendance: { $gte: dateRange.start, $lt: dateRange.end },
        },
      },
      {
        $project: {
          _id: 0,
          ...queryOptions.project,
          attendance: {
            $filter: {
              input: "$attendance",
              as: "att",
              cond: {
                $and: [
                  { $gte: ["$$att", dateRange.start] },
                  { $lt: ["$$att", dateRange.end] },
                ],
              },
            },
          },
        },
      },
      { $sort: queryOptions.sort },
    ],
    (e, data) => {
      if (e) {
        console.log(e);
        return res.status(500).json({ error: "Unable to fetch records", server: true });
      } else if (data.length === 0)
        return res.json({ error: "No records found", server: false });
      else return res.json(data);
    }
  );
};
