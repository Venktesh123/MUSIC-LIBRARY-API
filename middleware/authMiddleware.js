const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (req.path === "/login" || req.path === "/signup") {
    return next(); // Skip authentication
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authentication token missing or invalid." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach user data (decoded from JWT) to req.user
    next(); // Continue to the next middleware
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
