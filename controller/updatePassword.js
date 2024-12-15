const User = require("../models/User");
const bcrypt = require("bcrypt");
const createResponse = require("../utills/responseFormate");

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userData = req.user; // Current logged-in user's data

    // Validate that the request body contains the required fields
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json(
          createResponse(400, null, "Old and new passwords are required", null)
        );
    }

    // Ensure the current user exists
    const currentUser = await User.findOne({ email: userData.email });
    if (!currentUser) {
      return res
        .status(404)
        .json(createResponse(404, null, "Current user not found", null));
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
    console.log("Old password provided:", oldPassword);
    console.log("Stored password hash:", currentUser.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res
        .status(400)
        .json(createResponse(400, null, "Old password is incorrect", null));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("New password (hashed):", hashedPassword); // Log the new hashed password for debugging

    // Update the user's password in the database
    currentUser.password = hashedPassword;
    await currentUser.save();

    console.log("Password updated successfully for user:", currentUser.email);

    return res
      .status(200)
      .json(createResponse(200, null, "Password updated successfully", null));
  } catch (err) {
    console.error("Error in updating password:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error in updating password", null));
  }
};

module.exports = { updatePassword };
