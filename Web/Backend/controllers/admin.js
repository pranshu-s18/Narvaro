const { validationResult } = require("express-validator");
const { Admin, User } = require("../models");

exports.getUserByID = (req, res, next, id) =>
  Admin.findById(id, (e, admin) => {
    if (e) {
      console.log(e);
      return res
        .status(500)
        .json({ error: "Unable to fetch user from Database" });
    } else if (!admin) return res.status(400).json({ error: "User not found" });
    else {
      const { _id, name, email } = admin;
      req.profile = { _id, name, email };
    }
    next();
  });

exports.getAttendance = (req, res) => {
  const err = validationResult(req).array();

  if (err.length === 0) {
    User.find(req.body)
      .select("-_id -__v -uid -attendance._id")
      .exec((e, att) => {
        if (e) {
          console.log(e);
          return res.status(500).json({ error: "Unable to fetch records" });
        } else if (att.length === 0)
          return res.status(400).json({ error: "No records found" });
        else return res.json(att);
      });
  } else {
    let msg = "";
    err.forEach((er) => (msg = msg + "\n" + er.msg));
    return res.status(422).json({ error: msg.trim() });
  }
};
