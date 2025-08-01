const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists in request (set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Check if user has a role
      if (!req.user.role) {
        return res.status(403).json({ message: 'User role not defined' });
      }

      // Check if user's role is in the allowed roles array
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.',
          requiredRoles: allowedRoles,
          userRole: req.user.role
        });
      }

      // User is authorized, proceed to next middleware/route handler
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = roleMiddleware; 