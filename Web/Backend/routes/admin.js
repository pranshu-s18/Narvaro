const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthenticated } = require("../controllers/auth");
const { getUserByID } = require("../controllers/admin");

router.param("userID", getUserByID);

module.exports = router;
