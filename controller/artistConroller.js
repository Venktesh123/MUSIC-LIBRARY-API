const Artist = require("../models/Artist");
const createResponse = require("../utils/responseFormat"); // Assuming you have a utility for response format

// Create a new artist
const createArtist = async (req, res) => {
  try {
    const { name, grammy, hidden } = req.body;
    const { organization } = req.user;

    // Validate that required fields are present
    if (!name || !grammy) {
      return res
        .status(400)
        .json(
          createResponse(400, null, "Name and Grammy count are required", null)
        );
    }

    // Create a new artist
    const newArtist = new Artist({
      name,
      grammy,
      hidden: hidden || false,
      organization, // Hidden is optional, defaults to false
    });

    // Save the artist to the database
    await newArtist.save();

    return res
      .status(201)
      .json(
        createResponse(201, newArtist, "Artist created successfully", null)
      );
  } catch (err) {
    console.error("Error creating artist:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error creating artist", null));
  }
};

// Get all artists
const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    if (!artists || artists.length === 0) {
      return res
        .status(404)
        .json(createResponse(404, null, "No artists found", null));
    }

    return res
      .status(200)
      .json(
        createResponse(200, artists, "Artists retrieved successfully", null)
      );
  } catch (err) {
    console.error("Error retrieving artists:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error retrieving artists", null));
  }
};

// Get a single artist by ID
const getArtistById = async (req, res) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res
        .status(404)
        .json(createResponse(404, null, "Artist not found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, artist, "Artist retrieved successfully", null));
  } catch (err) {
    console.error("Error retrieving artist by ID:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error retrieving artist", null));
  }
};

// Update an artist by ID
const updateArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const { name, grammy, hidden } = req.body;

    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      { name, grammy, hidden },
      { new: true, runValidators: true }
    );

    if (!updatedArtist) {
      return res
        .status(404)
        .json(createResponse(404, null, "Artist not found", null));
    }

    return res
      .status(200)
      .json(
        createResponse(200, updatedArtist, "Artist updated successfully", null)
      );
  } catch (err) {
    console.error("Error updating artist:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error updating artist", null));
  }
};

// Delete an artist by ID
const deleteArtist = async (req, res) => {
  try {
    const artistId = req.params.id;

    const deletedArtist = await Artist.findByIdAndDelete(artistId);

    if (!deletedArtist) {
      return res
        .status(404)
        .json(createResponse(404, null, "Artist not found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, null, "Artist deleted successfully", null));
  } catch (err) {
    console.error("Error deleting artist:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error deleting artist", null));
  }
};

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
