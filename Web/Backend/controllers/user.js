const { User } = require("../models");
const { validationResult } = require("express-validator");

exports.register = (req, res) => {
  const err = validationResult(req).array();

  if (err.length === 0) {
    User.create(req.body, (e, user) => {
      if (e) {
        console.log(e);
        return res.status(500).json({ error: "Unable to register user" });
      } else
        return res
          .status(200)
          .json({ message: "User Registered successfully" });
    });
  } else {
    let msg = "";
    err.forEach((er) => (msg = msg + "\n" + er.msg));
    return res.status(422).json({ error: msg });
  }
};
