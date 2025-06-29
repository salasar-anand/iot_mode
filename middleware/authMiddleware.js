import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    const session = user.sessions.find((s) => s.token === token);

    if (!session) {
      return res.status(401).json({ msg: 'Session invalid or expired' });
    }

    if (session.expiresAt && new Date(session.expiresAt) < Date.now()) {
      return res.status(401).json({ msg: 'Session has expired' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    return res.status(401).json({ msg: 'Token is invalid or expired' });
  }
};

// Optional admin-only access middleware
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admins only' });
  }
  next();
};
