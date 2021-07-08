const { User } = require("../models");

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
  });
