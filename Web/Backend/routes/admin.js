const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthenticated } = require("../controllers/auth");
const { getUserByID, attendance } = require("../controllers/admin");
const { body, oneOf } = require("express-validator");

router.param("userID", getUserByID);
router.post(
  "/attendance/:userID",
  oneOf([
    body("hostel")
      .isIn(["BH1", "BH2", "BH3", "GH", "Test"])
      .withMessage("Invalid value for Hostel"),
    body("rollNo").notEmpty().withMessage("Roll Number is required"),
  ]),
  isLoggedIn,
  isAuthenticated,
  attendance
);

module.exports = router;
