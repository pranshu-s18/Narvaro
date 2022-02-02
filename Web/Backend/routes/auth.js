const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const passwordValidator = require("password-validator");
const { login, logout, register } = require("../controllers/auth");

const schema = new passwordValidator()
  .is()
  .min(8)
  .has()
  .letters()
  .has()
  .digits()
  .has()
  .symbols()
  .has()
  .not()
  .spaces();

router.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid value for E-Mail ID"),
  body("password")
    .custom((val) => schema.validate(val))
    .withMessage("Password must be at least 8 characters long, contain at least one number and contain at least one symbol"),
  register
);

router.post(
  "/login",
  body("email").normalizeEmail().isEmail().withMessage("Invalid value for E-Mail ID"),
  body("password").notEmpty().withMessage("Password is required"),
  login
);

router.get("/logout", logout);
module.exports = router;
