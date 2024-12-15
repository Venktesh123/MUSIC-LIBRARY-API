const express = require("express");
const roleMiddleware = require("../middleware/roleMddleware");
const router = express.Router();
const artistController = require("../controller/artistConroller");
router.use(roleMiddleware(["admin", "editor"]));
router.post("/artists", artistController.createArtist);

// Retrieve all artists
router.get("/artists", artistController.getAllArtists);

// Retrieve a single artist by ID
router.get("/artists/:id", artistController.getArtistById);

// Update an artist by ID
router.put("/artists/:id", artistController.updateArtist);

// Delete an artist by ID
router.delete("/artists/:id", artistController.deleteArtist);

module.exports = router;
