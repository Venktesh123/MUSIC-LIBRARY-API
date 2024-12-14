const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  let token;
  let authHeader = req.heafers.Authorization || req.heafers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split()[1];
  }
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    return res.status(200).json({ message: "Decoded Use", User: req.user });
  } catch (err) {
    return res.satus(400).json({ message: "Errorin Verifying Token" });
  }
};
module.exports = verifyToken;
