const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { register } = require("../controllers/user");

router.post(
  "/register",
  check("email").isEmail().withMessage("Invalid value for E-Mail ID"),
  check("token").notEmpty().withMessage("Token is required"),
  register
);

module.exports = router;