const Favorite = require("../models/Favorite");
const Artist = require("../models/Artist");
const Album = require("../models/Album");
const Track = require("../models/Track");
const User = require("../models/User");

// Add a Favorite
const addFavorite = async (req, res) => {
  const { category, favoriteId } = req.body;
  const { email } = req.user; // Assuming the user is authenticated and the email is extracted from the JWT token

  console.log(email);

  // Validate the category
  if (!["artist", "album", "track"].includes(category)) {
    return res.status(400).json({
      message: "Invalid category. Must be one of: artist, album, track.",
    });
  }

  try {
    // Find the current user by email
    const currentUser = await User.findOne({ email });

    // If the user is not found, return an error
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate the existence of the favoriteId in the corresponding schema
    let exists;
    if (category === "artist") {
      exists = await Artist.findById(favoriteId);
    } else if (category === "album") {
      exists = await Album.findById(favoriteId);
    } else if (category === "track") {
      exists = await Track.findById(favoriteId);
    }

    // If the item does not exist, return a 404 error
    if (!exists) {
      return res
        .status(404)
        .json({ message: `${category} not found with the provided ID.` });
    }

    // Check if the favorite already exists for the user
    const existingFavorite = await Favorite.findOne({
      userId: currentUser._id,
      category,
      favoriteId,
    });

    if (existingFavorite) {
      return res
        .status(409)
        .json({ message: "This favorite already exists for the user." });
    }

    // Create a new favorite entry
    const newFavorite = new Favorite({
      userId: currentUser._id,
      category,
      favoriteId,
    });
    await newFavorite.save();

    return res
      .status(201)
      .json({ message: "Favorite added successfully", favorite: newFavorite });
  } catch (error) {
    // Handle generic server error
    console.error(error); // Log the error for debugging purposes
    return res
      .status(500)
      .json({ message: "Server error occurred", error: error.message });
  }
};

// Retrieve Favorites by Category
const FavoriteByCategory = async (req, res) => {
  const { category } = req.params;
  const { userId } = req.query;

  // Validate the category
  if (!["artist", "album", "track"].includes(category)) {
    return res.status(400).json({
      message: "Invalid category. Must be one of: artist, album, track.",
    });
  }

  try {
    // Fetch favorites for the user and category
    const favorites = await Favorite.find({ userId, category });

    // If no favorites found, return an empty array
    if (!favorites.length) {
      return res.status(200).json([]);
    }

    // Populate favorite details based on category
    const populatedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        let details;
        if (category === "artist") {
          details = await Artist.findById(fav.favoriteId);
        } else if (category === "album") {
          details = await Album.findById(fav.favoriteId).populate("artistId");
        } else if (category === "track") {
          details = await Track.findById(fav.favoriteId).populate({
            path: "albumId",
            populate: { path: "artistId" },
          });
        }

        // Return the favorite with the additional details
        return { ...fav._doc, details };
      })
    );

    return res.status(200).json(populatedFavorites);
  } catch (error) {
    // Handle generic server error
    return res
      .status(500)
      .json({ message: "Server error occurred", error: error.message });
  }
};

// Delete a Favorite
const deleteFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the favorite by ID
    const deletedFavorite = await Favorite.findByIdAndDelete(id);

    // If no favorite found with the ID, return a 404 error
    if (!deletedFavorite) {
      return res
        .status(404)
        .json({ message: "Favorite not found with the provided ID." });
    }

    return res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    // Handle generic server error
    return res
      .status(500)
      .json({ message: "Server error occurred", error: error.message });
  }
};

// Export the controllers
module.exports = {
  addFavorite,
  FavoriteByCategory,
  deleteFavorite,
};
