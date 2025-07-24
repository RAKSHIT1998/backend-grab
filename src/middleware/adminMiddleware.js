// src/middleware/adminMiddleware.js

import asyncHandler from 'express-async-handler';

export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Admins only.');
  }
});

export const allowedRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      throw new Error(`Access denied. Allowed roles: ${roles.join(', ')}`);
    }
  });
};
