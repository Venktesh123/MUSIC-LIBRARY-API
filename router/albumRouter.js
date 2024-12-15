const express = require("express");
const roleMiddleware = require("../middleware/roleMddleware");
const router = express.Router();
const {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} = require("../controllers/albumController");
router.use(roleMiddleware(["admin", "editor"]));
// Create a new album
router.post("/albums/add-album", createAlbum);

// Retrieve all albums
router.get("/albums", getAllAlbums);

// Retrieve a single album by ID
router.get("/albums/:id", getAlbumById);

// Update an album by ID
router.put("/albums/:id", updateAlbum);

// Delete an album by ID
router.delete("/albums/:id", deleteAlbum);

module.exports = router;
