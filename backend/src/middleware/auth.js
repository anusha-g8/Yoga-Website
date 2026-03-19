import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'member-secret-key-123';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-123';

export const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.memberId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const optionalAuth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.memberId = decoded.id;
    next();
  } catch (err) {
    // If token is provided but invalid, we still proceed as guest but log it
    console.warn('Optional auth token invalid:', err.message);
    next();
  }
};

export const adminAuth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No admin token, authorization denied' });
  }

  if (token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ message: 'Admin token is not valid' });
  }
};
