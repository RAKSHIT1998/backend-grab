// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(401).json({ message: "Authorization token missing" });
  }
};

// src/utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (user, expiresIn = "7d") => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email || null,
      phone: user.phone || null,
    },
    process.env.JWT_SECRET || "defaultsecret",
    {
      expiresIn,
    }
  );
};

// Example usage in a protected route
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/protected', protect, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

export default router;
