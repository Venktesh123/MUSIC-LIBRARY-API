const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true, // Organization can be empty
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "viewer", "editor"],
      default: "viewer", // Default role if nothing is provided
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
