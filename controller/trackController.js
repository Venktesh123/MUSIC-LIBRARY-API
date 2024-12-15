const Track = require("../models/Track");
const createResponse = require("../utils/responseFormat"); // Assuming you have a utility for response format

// Create a new track
const createTrack = async (req, res) => {
  try {
    const { name, duration, hidden = false, album } = req.body; // Default hidden to false
    const { organization } = req.user; // Extract organization directly for clarity

    // Validate required fields
    if (!name || !duration || !album) {
      return res
        .status(400)
        .json(
          createResponse(
            400,
            null,
            "Name, duration, and album are required",
            null
          )
        );
    }

    // Validate duration is a positive number
    if (isNaN(duration) || duration <= 0) {
      return res
        .status(400)
        .json(
          createResponse(400, null, "Duration must be a positive number", null)
        );
    }

    // Create and save the new track
    const newTrack = new Track({
      name,
      duration,
      hidden,
      album,
      organization,
    });

    await newTrack.save();

    return res
      .status(201)
      .json(createResponse(201, newTrack, "Track created successfully", null));
  } catch (err) {
    console.error("Error creating track:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error creating track", null));
  }
};

// Get all tracks
const getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find().populate("album"); // Populating album for detailed info
    if (!tracks || tracks.length === 0) {
      return res
        .status(404)
        .json(createResponse(404, null, "No tracks found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, tracks, "Tracks retrieved successfully", null));
  } catch (err) {
    console.error("Error retrieving tracks:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error retrieving tracks", null));
  }
};

// Get a single track by ID
const getTrackById = async (req, res) => {
  try {
    const trackId = req.params.id;
    const track = await Track.findById(trackId).populate("album");

    if (!track) {
      return res
        .status(404)
        .json(createResponse(404, null, "Track not found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, track, "Track retrieved successfully", null));
  } catch (err) {
    console.error("Error retrieving track by ID:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error retrieving track", null));
  }
};

// Update a track by ID
const updateTrack = async (req, res) => {
  try {
    const trackId = req.params.id;
    const { name, duration, hidden, album } = req.body;

    const updatedTrack = await Track.findByIdAndUpdate(
      trackId,
      { name, duration, hidden, album },
      { new: true, runValidators: true }
    ).populate("album");

    if (!updatedTrack) {
      return res
        .status(404)
        .json(createResponse(404, null, "Track not found", null));
    }

    return res
      .status(200)
      .json(
        createResponse(200, updatedTrack, "Track updated successfully", null)
      );
  } catch (err) {
    console.error("Error updating track:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error updating track", null));
  }
};

// Delete a track by ID
const deleteTrack = async (req, res) => {
  try {
    const trackId = req.params.id;

    const deletedTrack = await Track.findByIdAndDelete(trackId);

    if (!deletedTrack) {
      return res
        .status(404)
        .json(createResponse(404, null, "Track not found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, null, "Track deleted successfully", null));
  } catch (err) {
    console.error("Error deleting track:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error deleting track", null));
  }
};

module.exports = {
  createTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
};
