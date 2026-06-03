'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const { rateLimiterGlobal } = require('./config/security');
const router = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./config/logger');

const app = express();

const FRONTEND_OUT = path.join(__dirname, '..', 'frontend', 'out');

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:'],
      objectSrc:  ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} not permitted.`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

// Global rate limiter
app.use(rateLimiterGlobal);

// Request parsing
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true, limit: '512kb' }));
app.use(compression());

// HTTP request logging
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
  skip: (req) => req.url === '/health',
}));

// Trust proxy (Nginx / VPS reverse proxy)
app.set('trust proxy', 1);

// Health check endpoint - unauthenticated
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'operational', timestamp: new Date().toISOString() });
});

// API routes
app.use(process.env.API_PREFIX || '/api/v1', router);

// Frontend static files (Next.js export)
app.use(express.static(FRONTEND_OUT));

// SPA fallback — serve index.html for any non-API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path === '/health') return next();
  res.sendFile(path.join(FRONTEND_OUT, 'index.html'), (err) => {
    if (err) res.status(404).json({ code: 'RESOURCE_NOT_FOUND', message: 'The requested resource does not exist.' });
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
