// src/middleware/roleMiddleware.js

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// Example usage in routes:
// import { requireRole } from '../middleware/roleMiddleware.js';
// router.get('/some-protected-route', authMiddleware, requireRole(['bike', 'porter']), handler);
