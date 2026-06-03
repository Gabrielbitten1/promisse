'use strict';

const rateLimit = require('express-rate-limit');

const rateLimiterGlobal = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please retry after the cooldown period.',
  },
  skip: (req) => req.url === '/health',
});

const rateLimiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Too many authentication attempts. Account temporarily locked.',
  },
});

const rateLimiterAI = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AI_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    code: 'AI_QUOTA_EXCEEDED',
    message: 'AI analysis quota reached for this period. Resets hourly.',
  },
});

module.exports = { rateLimiterGlobal, rateLimiterAuth, rateLimiterAI };
