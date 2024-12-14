const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res
      .status(403)
      .json({ error: "User is not authenticated or role is missing." });
  }

  if (req.user.role !== requiredRole) {
    return res
      .status(403)
      .json({ error: `Access denied. ${requiredRole} role required.` });
  }

  next();
};

module.exports = roleMiddleware;
