const { User } = require("../models");
const { validationResult } = require("express-validator");
const moment = require("moment");
require("moment/locale/en-in");

exports.register = (req, res) =>
  User.create(req.body, (e, user) => {
    if (e) {
      console.log(e);
      return res.status(500).json({ error: "Unable to register user" });
    } else
      return res.status(200).json({ message: "User Registered successfully" });
  });

exports.markAttendance = (req, res) => {
  const err = validationResult(req).array();

  if (err.length === 0) {
    User.findOneAndUpdate(
      {
        ...req.body,
        lastUpdate: { $ne: moment().startOf("day").toDate() },
      },
      {
        $push: { attendance: Date.now() },
        $set: { lastUpdate: moment().startOf("day").toDate() },
      },
      (e, user) => {
        if (e) {
          console.log(e);
          return res.status(500).json({ error: "Unable to mark attendance" });
        } else if (!user)
          return res
            .status(400)
            .json({ error: "Attendance already marked for Today" });
        else
          return res
            .status(200)
            .json({ message: "Attendance marked successfully" });
      }
    );
  } else {
    let msg = "";
    err.forEach((er) => (msg = msg + "\n" + er.msg));
    return res.status(422).json({ error: msg.trim() });
  }
};
