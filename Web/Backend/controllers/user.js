const { User } = require("../models");
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

exports.markAttendance = (req, res) =>
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
