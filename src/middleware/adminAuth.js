// src/middleware/adminAuth.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const key = "#479@/^5149*@123"; // Use env variable in production

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, key, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const admin = await userModel.findById(decoded.id);
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      req.admin = admin;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = adminAuth;
