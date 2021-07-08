const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthenticated } = require("../controllers/auth");
const { getUserByID, getAttendance } = require("../controllers/admin");
const { body } = require("express-validator");

router.param("userID", getUserByID);
router.post(
  "/attendance/:userID",
  body("hostel")
    .isIn(["BH1", "BH2", "BH3", "GH", "Test"])
    .withMessage("Invalid value for Hostel"),
  isLoggedIn,
  isAuthenticated,
  getAttendance
);

module.exports = router;
