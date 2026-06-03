'use strict';

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'MISSING_TOKEN',
      message: 'Authorization token is required.',
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'engishield-api',
      audience: 'engishield-client',
    });

    req.user = { id: payload.sub, role: payload.role, empresaId: payload.empresaId };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Token has expired.' });
    }
    return res.status(401).json({ code: 'INVALID_TOKEN', message: 'Token is invalid or malformed.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Insufficient privileges to perform this operation.',
    });
  }
  next();
};

module.exports = { verifyToken, authorize };
