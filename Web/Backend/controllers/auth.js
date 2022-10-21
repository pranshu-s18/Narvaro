const { Admin } = require("../models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.register = (req, res) => {
  const err = validationResult(req).array();

  if (err.length === 0) {
    Admin.create(req.body, (e, user) => {
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
    return res.status(422).json({ error: msg.trim() });
  }
};

exports.login = (req, res) => {
  const err = validationResult(req).array();

  if (err.length === 0) {
    const { email, password } = req.body;

    Admin.findOne({ email }, (e, user) => {
      if (e) {
        console.log(e);
        return res.status(500).json({ error: "Server Error occurred" });
      } else if (!user || !user.auth(password))
        return res.status(401).json({ error: "Invalid email or password" });
      else {
        const token = jwt.sign({ _id: user._id }, process.env.NODE_KEY);
        res.cookie("token", token, { maxAge: 600000 }); // 10 min

        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      }
    });
  } else {
    let msg = "";
    err.forEach((er) => (msg = msg + "\n" + er.msg));
    return res.status(422).json({ error: msg.trim() });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "User logged out successfully" });
};

exports.isLoggedIn = expressJwt({
  secret: process.env.NODE_KEY,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.isAuthenticated = (req, res, next) => {
  if (!(req.profile && req.auth && req.profile._id == req.auth._id))
    return res.status(403).json({ error: "ACCESS DENIED" });
  next();
};
