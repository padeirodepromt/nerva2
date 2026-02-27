// src/api/auth/middleware.js
// Authentication middleware

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'prana_secret_key_change_me';

/**
 * Middleware to extract user email from request
 * Expects Authorization header with Bearer token or session
 */
export const getUserEmail = (req, res, next) => {
  // Implement proper JWT/session validation
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { email: decoded.email, id: decoded.id };
      return next();
    } catch (error) {
      console.error('[Auth] Token inválido:', error.message);
    }
  }
  
  const email = req.session?.user?.email || null;
  
  if (!email) {
    return res.status(401).json({ error: 'Unauthorized: No user email found' });
  }
  
  req.user = { email };
  next();
};

/**
 * Middleware to require authentication
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
