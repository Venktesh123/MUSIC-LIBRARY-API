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

router.delete("/delete-user/:id", (req, res) => {
  res.json({ message: `User with ID ${req.params.id} deleted by Admin!` });
});

router.get("/settings", (req, res) => {
  res.json({ message: "Admin settings loaded!" });
});

module.exports = router;
