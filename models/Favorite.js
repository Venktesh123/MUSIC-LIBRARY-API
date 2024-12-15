const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  // This schema can just hold a unique ID (assuming it's a reference or simple identifier)
  // Add any other properties if needed in the future
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
