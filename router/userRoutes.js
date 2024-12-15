const express = require("express");
const router = express.Router();
const updateController = require("../controller/updatePassword");
router.put("/users/update-password", updateController.updatePassword);
module.exports = router;
