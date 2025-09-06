const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// 🔒 Middleware to protect routes by verifying JWT tokens
module.exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header ("Bearer <token>")
    const token = req.headers.authorization.split(" ")[1];
    console.log(`authtoken:${token}`);

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify token using the JWT_SECRET key from .env
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    if (!decoded) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Find the user in the database using the ID from the token
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
