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
  User.findOne(req.body, (e, user) => {
    if (e) {
      console.log(e);
      return res.status(500).json({ error: "Unable to mark attendance" });
    } else {
      if (moment(user.updatedAt).day === moment().day)
        return res
          .status(400)
          .json({ error: "Attendance has already been marked for Today" });
      else {
        user.attendance.push({ date: Date.now(), present: true });
        user.save((err, newUser) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Unable to mark attendance" });
          } else
            return res
              .status(200)
              .json({ message: "Attendance marked successfully" });
        });
      }
    }
  });
