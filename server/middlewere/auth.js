const jwt = require("jsonwebtoken");
const User = require("../models/Users"); // Import User model
require("dotenv").config(); // Ensure environment variables are loaded

const authenticateUser = async (req, res, next) => {
  try {
    // Extract Bearer token from Authorization header
    const token = req.header("Authorization")?.split(" ")[1];
    // console.log("hello",token);
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify Token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    if (!decoded.userId) {
      return res.status(403).json({ message: "Invalid token format." });
    }

    // Fetch user from DB to ensure they exist (Optional but recommended)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = authenticateUser;
