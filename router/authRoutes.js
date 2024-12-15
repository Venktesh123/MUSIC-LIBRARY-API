const express = require("express");
const router = express.Router();
const { login, SignUp, logout } = require("../controller/auhController");
router.post("/signup", SignUp);
router.post("/login", login);
router.post("/logout", logout);
module.exports = router;
