'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const logger = require('../config/logger');

const signTokens = (user) => {
  const payload = { sub: user.id, role: user.role, empresaId: user.empresaId };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: 'engishield-api',
    audience: 'engishield-client',
  });

  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'engishield-api',
    audience: 'engishield-client',
  });

  return { accessToken, refreshToken };
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      logger.warn('Failed login attempt', { email, ip: req.ip });
      return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' });
    }

    const { accessToken, refreshToken } = signTokens(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, lastLoginAt: new Date() },
    });

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900,
      token_type: 'Bearer',
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    let payload;
    try {
      payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, {
        algorithms: ['HS256'],
        issuer: 'engishield-api',
        audience: 'engishield-client',
      });
    } catch {
      return res.status(401).json({ code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired.' });
    }

    const user = await prisma.user.findFirst({
      where: { id: payload.sub, refreshToken: refresh_token, isActive: true },
    });

    if (!user) {
      return res.status(401).json({ code: 'TOKEN_REUSE_DETECTED', message: 'Refresh token reuse detected. Session terminated.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = signTokens(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.json({ access_token: accessToken, refresh_token: newRefreshToken, expires_in: 900, token_type: 'Bearer' });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const decoded = jwt.decode(authHeader.slice(7));
      if (decoded?.sub) {
        await prisma.user.update({ where: { id: decoded.sub }, data: { refreshToken: null } }).catch(() => {});
      }
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refresh, logout };
