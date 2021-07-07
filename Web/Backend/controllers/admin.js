const { Admin } = require("../models");
const { validationResult } = require("express-validator");

exports.getUserByID = (req, res, next, id) => {
  Admin.findById(id, (e, admin) => {
    if (e) {
      console.log(e);
      return res
        .status(500)
        .json({ error: "Unable to fetch user from Database" });
    } else if (!user) return res.status(400).json({ error: "User not found" });
    else {
      const { _id, name, email } = user;
      req.profile = { _id, name, email };
    }
    next();
  });
};
