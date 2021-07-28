const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthenticated } = require("../controllers/auth");
const { getUserByID, attendance } = require("../controllers/admin");

router.param("userID", getUserByID);
router.post("/attendance/:userID", isLoggedIn, isAuthenticated, attendance);

module.exports = router;
