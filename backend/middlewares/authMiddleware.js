import jwt from 'jsonwebtoken';
import User, { getUserModelByDb } from '../models/User.js';

// Middleware to protect routes via JWT verification
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_voting_system_key_2026'
      );

      // Search in 'voting' DB first (Admin), then 'test' DB (Voter)
      let user = await getUserModelByDb('voting').findById(decoded.id).select('-password');
      if (!user) {
        user = await getUserModelByDb('test').findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to restrict route access by role (admin/voter)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user?.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
