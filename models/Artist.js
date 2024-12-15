const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  grammy: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  organization: {
    type: String, // Add validation if needed (e.g., minlength, maxlength)
    required: true,
  },
});

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
