const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number, // duration in seconds
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  organization: {
    type: String, // Add validation if needed (e.g., minlength, maxlength)
    required: true,
  },
  // Reference to Album model (each track belongs to one album)
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
    required: true,
  },
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
