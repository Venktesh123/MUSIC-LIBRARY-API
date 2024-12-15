const Album = require("../models/Album");
const createResponse = require("../utils/responseFormat"); // Assuming you have a utility for response format

// Create a new album
const createAlbum = async (req, res) => {
  try {
    const { name, year, hidden, artist, tracks } = req.body;
    const { organization } = req.user;

    // Validate that required fields are present
    if (!name || !year || !artist) {
      return res
        .status(400)
        .json(
          createResponse(400, null, "Name, year, and artist are required", null)
        );
    }

    // Create a new album
    const newAlbum = new Album({
      name,
      year,
      hidden: hidden || false, // Hidden is optional, defaults to false
      artist,
      tracks: tracks || [], // tracks are optional, defaults to empty array
      organization,
    });

    // Save the album to the database
    await newAlbum.save();

    return res
      .status(201)
      .json(createResponse(201, newAlbum, "Album created successfully", null));
  } catch (err) {
    console.error("Error creating album:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error creating album", null));
  }
};

// Get all albums
const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate("artist tracks"); // Populating artist and tracks for detailed info
    if (!albums || albums.length === 0) {
      return res
        .status(404)
        .json(createResponse(404, null, "No albums found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, albums, "Albums retrieved successfully", null));
  } catch (err) {
    console.error("Error retrieving albums:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error retrieving albums", null));
  }
};

// Get a single album by ID
const getAlbumById = async (req, res) => {
  try {
    const albumId = req.params.id;
    const album = await Album.findById(albumId).populate("artist tracks");

    if (!album) {
      return res
        .status(404)
        .json(createResponse(404, null, "Album not found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, album, "Album retrieved successfully", null));
  } catch (err) {
    console.error("Error retrieving album by ID:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error retrieving album", null));
  }
};

// Update an album by ID
const updateAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const { name, year, hidden, artist, tracks } = req.body;

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { name, year, hidden, artist, tracks },
      { new: true, runValidators: true }
    ).populate("artist tracks");

    if (!updatedAlbum) {
      return res
        .status(404)
        .json(createResponse(404, null, "Album not found", null));
    }

    return res
      .status(200)
      .json(
        createResponse(200, updatedAlbum, "Album updated successfully", null)
      );
  } catch (err) {
    console.error("Error updating album:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error updating album", null));
  }
};

// Delete an album by ID
const deleteAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;

    const deletedAlbum = await Album.findByIdAndDelete(albumId);

    if (!deletedAlbum) {
      return res
        .status(404)
        .json(createResponse(404, null, "Album not found", null));
    }

    return res
      .status(200)
      .json(createResponse(200, null, "Album deleted successfully", null));
  } catch (err) {
    console.error("Error deleting album:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error deleting album", null));
  }
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
};
