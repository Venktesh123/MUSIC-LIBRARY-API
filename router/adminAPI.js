const express = require("express");
const roleMiddleware = require("../middleware/roleMddleware");

const router = express.Router();
const adminController = require("../controller/adminConrollers");

// Apply roleMiddleware to all routes in this router
router.use(roleMiddleware(["admin"]));

// Admin-specific routes
router.get("/users", adminController.allUsers);
router.post("/adduser", adminController.addUser);

router.delete("/user", adminController.deleteUser);

module.exports = router;
