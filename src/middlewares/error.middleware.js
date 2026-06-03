'use strict';

const { Prisma } = require('@prisma/client');
const logger = require('../config/logger');

const errorHandler = (err, req, res, _next) => {
  logger.error('Request error', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  // Prisma constraint violations
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        message: `A record with this ${err.meta?.target?.join(', ')} already exists.`,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Record not found.' });
    }
    if (err.code === 'P2003') {
      return res.status(409).json({
        code: 'FOREIGN_KEY_VIOLATION',
        message: 'Operation violates referential integrity constraint.',
      });
    }
  }

  // Validation errors (Joi)
  if (err.name === 'ValidationError') {
    return res.status(422).json({ code: 'VALIDATION_ERROR', message: err.message, details: err.details });
  }

  // CORS rejection
  if (err.message?.includes('not permitted')) {
    return res.status(403).json({ code: 'CORS_REJECTED', message: err.message });
  }

  // Default internal server error - never expose stack in production
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Contact support if the issue persists.'
      : err.message,
  });
};

module.exports = errorHandler;
