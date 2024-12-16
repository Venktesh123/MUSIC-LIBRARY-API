const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to a User model
    },
    category: {
      type: String,
      enum: ["artist", "album", "track"], // Allowed categories
      required: true,
    },
    favoriteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Links to Artist, Album, or Track ID
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// Ensure a user can't favorite the same item more than once
favoriteSchema.index(
  { userId: 1, category: 1, favoriteId: 1 },
  { unique: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
