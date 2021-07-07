const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { login, logout, register } = require("../controllers/auth");

router.post(
  "/register",
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid value for E-Mail ID"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters"),
  register
);

router.post(
  "/login",
  check("email").isEmail().withMessage("Invalid value for E-Mail ID"),
  check("password").notEmpty().withMessage("Password is required"),
  login
);

router.get("/logout", logout);
module.exports = router;
