const express = require("express");
const router = express.Router();
const controller = require("../controller/auhController");
router.post("sign-up", controller.SignUp);
router.post("login", controller.login);
module.exports = router;
