const User = require("../models/User");
const organization = require("../models/Organization");
const createResponse = require("../utills/responseFormate");
const bcrypt = require("bcrypt");

const allUsers = async (req, res) => {
  try {
    const userData = req.user;
    console.log("Fetching user data...");

    // Step 1: Find the user by ID and get their organization
    const currentUser = await User.findById(userData.email);

    if (!currentUser) {
      return res
        .status(404)
        .json(createResponse(404, null, "User not found", null));
    }

    // Step 2: Find all users in the same organization
    const usersInSameOrg = await User.find({
      organization: currentUser.organization,
    });

    // Step 3: Return the list of users
    return res
      .status(200)
      .json(
        createResponse(200, usersInSameOrg, "Users fetched successfully", null)
      );
  } catch (err) {
    console.error("Error in getting user data", err);
    return res
      .status(500)
      .json(
        createResponse(500, null, "Error in getting user data", err.message)
      );
  }
};

const addUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const userData = req.user;

    if (!userData || !userData.id) {
      return res
        .status(400)
        .json(createResponse(400, null, "Invalid request", null));
    }

    const currentUser = await User.findById(userData.email);

    if (!currentUser) {
      return res
        .status(404)
        .json(createResponse(404, null, "Current user not found", null));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(createResponse(409, null, "Email already in use", null));
    }

    // Validate role
    const validRoles = ["viewer", "editor"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json(createResponse(400, null, "Invalid role", null));
    }

    // Hash password securely
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res
        .status(500)
        .json(createResponse(500, null, "Error hashing password", err.message));
    }

    // Create and save the new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      organization: currentUser.organization,
    });

    await newUser.save();

    return res.status(201).json(
      createResponse(
        201,
        {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
        "User created successfully",
        null
      )
    );
  } catch (err) {
    console.error("Error in creating user:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error in creating user", err.message));
  }
};
const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.query.id; // User ID to delete from query param
    const userData = req.user; // Current logged-in user's data

    // Validate that the query parameter is provided
    if (!userIdToDelete) {
      return res
        .status(400)
        .json(
          createResponse(400, null, "User ID is required in query params", null)
        );
    }

    // Ensure the current user exists
    const currentUser = await User.findOne({ email: userData.email });
    if (!currentUser) {
      return res
        .status(404)
        .json(createResponse(404, null, "Current user not found", null));
    }

    // Find the user to delete by ID
    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
      return res
        .status(404)
        .json(createResponse(404, null, "User to delete not found", null));
    }

    // Check if both users belong to the same organization
    if (
      currentUser.organization &&
      userToDelete.organization &&
      currentUser.organization.toString() !==
        userToDelete.organization.toString()
    ) {
      return res
        .status(403)
        .json(createResponse(403, null, "Organizations do not match", null));
    }

    // Delete the user
    await userToDelete.deleteOne();

    return res
      .status(200)
      .json(createResponse(200, null, "User deleted successfully", null));
  } catch (err) {
    console.error("Error in deleting user:", err);
    return res
      .status(500)
      .json(createResponse(500, null, "Error in deleting user", null));
  }
};
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
    if (!isMatch) {
      return res
        .status(400)
        .json(createResponse(400, null, "Old password is incorrect", null));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    currentUser.password = hashedPassword;
    await currentUser.save();

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

module.exports = { allUsers, addUser, deleteUser };
