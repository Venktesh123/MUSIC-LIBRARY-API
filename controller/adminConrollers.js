const User = require("../models/User");
const organization = require("../models/Organization");
const createResponse = require("../utills/responseFormate");
const bcrypt = require("bcrypt");

const allUsers = async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData, "userData");

    // Step 1: Find the user by ID and get their organization
    const currentUser = await User.findById(userData.id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Step 3: Find all users in the same organization
    const usersInSameOrg = await User.find({ organization: userOrganization });

    // Step 4: Return the list of users
    return res.status(200).json({
      message: "Users from the same organization",
      users: usersInSameOrg,
    });
  } catch (err) {
    console.log("Error in getting user data", err);
    return res.status(500).json({
      message: "Error in getting user data",
      error: err.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    // Destructure the request body to get email, password, and role
    const { email, password, role } = req.body;
    const userData = req.user;

    // Ensure that the currentUser exists
    if (!userData || !userData.id) {
      return res.status(400).json({
        message: "User data not found or invalid request",
      });
    }

    const currentUser = await User.findById(userData.id);

    // Ensure the currentUser exists
    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    // Check if the role is valid
    const validRoles = ["viewer", "editor"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Role must be 'viewer' or 'editor'",
      });
    }

    const organization = currentUser.organization;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with hashed password
    const newUser = new User({
      email,
      password: hashedPassword, // Storing hashed password
      role,
      organization,
    });

    // Save the user to the database
    await newUser.save();

    // Send a response back confirming the user creation
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error in creating user:", err);
    return res.status(500).json({
      message: "Error in creating user",
      error: err.message,
    });
  }
};
module.exports = { allUsers, addUser };
