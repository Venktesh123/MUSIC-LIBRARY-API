const express = require("express");
const router = express.Router();
const { login, SignUp } = require("../controller/auhController");
console.log("kl");
router.post("/signup", SignUp);
router.post("/login", login);
module.exports = router;
