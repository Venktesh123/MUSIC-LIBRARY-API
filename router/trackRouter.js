const express = require("express");
const roleMiddleware = require("../middleware/roleMddleware");
const router = express.Router();
const {
  createTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
} = require("../controllers/trackController");
router.use(roleMiddleware(["admin", "editor"]));

// Create a new track
router.post("/tracks/add-track", createTrack);

// Retrieve all tracks
router.get("/tracks", getAllTracks);

// Retrieve a single track by ID
router.get("/tracks/:id", getTrackById);

// Update a track by ID
router.put("/tracks/:id", updateTrack);

// Delete a track by ID
router.delete("/tracks/:id", deleteTrack);

module.exports = router;
