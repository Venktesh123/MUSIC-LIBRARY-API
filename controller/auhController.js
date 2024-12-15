const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

const SignUp = async (req, res) => {
  console.log("signup");
  try {
    const { name, email, password, organizationName } = req.body;

    // Validate input
    if (!name || !email || !password || !organizationName) {
      return res.status(400).json({
        error: "Name, email, password, and organizationName are required.",
      });
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Find or create the organization
    let organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      organization = new Organization({ name: organizationName });
      await organization.save();
    }

    // Check if this is the first user in the organization
    const existingOrgUsers = await User.find({
      organization: organization._id,
    });
    const role = existingOrgUsers.length === 0 ? "admin" : "viewer";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      organization: organization._id,
      role,
    });

    await user.save();

    return res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: organization.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to log in a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: `User not found with email: ${email}` });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
const logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authentication token missing or invalid." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from header

  // Remove token from active tokens list
  if (activeTokens.has(token)) {
    activeTokens.delete(token); // Remove the token
    return res
      .status(200)
      .json({ message: "Logout successful. Token invalidated." });
  }

  return res.status(400).json({ error: "Token already invalid or not found." });
};

module.exports = { SignUp, login, logout };
