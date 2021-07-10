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

exports.attendanceForCurrentWeek = (req, res) => {
  const err = validationResult(req).array();

  if (err.length === 0) {
    User.aggregate(
      [
        {
          $match: {
            hostel: req.body.hostel,
            "attendance.date": {
              $gte: moment().startOf("week").toDate(),
              $lt: moment().endOf("week").toDate(),
            },
          },
        },
        {
          $project: {
            _id: 0,
            rollNo: 1,
            attendance: {
              $filter: {
                input: "$attendance",
                as: "att",
                cond: {
                  $and: [
                    { $gte: ["$$att.date", moment().startOf("week").toDate()] },
                    { $lt: ["$$att.date", moment().endOf("week").toDate()] },
                  ],
                },
              },
            },
          },
        },
        { $sort: { rollNo: 1 } },
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
