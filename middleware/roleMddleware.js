const roleMiddleware = (requiredRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res
      .status(403)
      .json({ error: "User is not authenticated or role is missing." });
  }

  // Check if the user's role is included in the required roles
  if (!requiredRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({
        error: `Access denied. One of the following roles is required: ${requiredRoles.join(
          ", "
        )}`,
      });
  }

  next();
};

module.exports = roleMiddleware;
