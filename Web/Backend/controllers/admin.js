const { validationResult } = require("express-validator");
const { Admin, User } = require("../models");

const moment = require("moment");
require("moment/locale/en-in");
moment.updateLocale("en-in", { week: { dow: 1 } });

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
  const err = validationResult(req).array();

  if (err.length === 0) {
    const query = req.body.hostel
      ? {
          start: moment().startOf("week").toDate(),
          end: moment().endOf("week").toDate(),
          project: { rollNo: 1 },
          sort: { rollNo: 1 },
        }
      : {
          start: moment().startOf("month").toDate(),
          end: moment().endOf("month").toDate(),
          project: { hostel: 1 },
          sort: { attendance: -1 },
        };

    User.aggregate(
      [
        {
          $match: {
            ...req.body,
            attendance: { $gte: query.start, $lt: query.end },
          },
        },
        {
          $project: {
            _id: 0,
            ...query.project,
            attendance: {
              $filter: {
                input: "$attendance",
                as: "att",
                cond: {
                  $and: [
                    { $gte: ["$$att", query.start] },
                    { $lt: ["$$att", query.end] },
                  ],
                },
              },
            },
          },
        },
        { $sort: query.sort },
      ],
      (e, data) => {
        if (e) {
          console.log(e);
          return res.status(500).json({ error: "Unable to fetch records" });
        } else if (data.length === 0)
          return res.status(400).json({ error: "No records found" });
        else return res.json(data);
      }
    );
  } else {
    let msg = "";
    err.forEach((er) => (msg = msg + "\n" + er.msg));
    return res.status(422).json({ error: msg.trim() });
  }
};
