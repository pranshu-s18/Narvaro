const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, markAttendance } = require("../controllers/user");

router.post("/register", register);
router.post(
  "/attendance",
  body("hostel")
    .isIn(["BH1", "BH2", "BH3", "GH", "Test"])
    .withMessage("Invalid value for Hostel"),
  markAttendance
);

module.exports = router;
