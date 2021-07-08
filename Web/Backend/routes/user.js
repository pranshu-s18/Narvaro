const express = require("express");
const router = express.Router();
const { register, markAttendance } = require("../controllers/user");

router.post("/register", register);
router.post("/attendance", markAttendance);

module.exports = router;