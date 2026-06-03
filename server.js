'use strict';

require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`EngiShield API running on port ${PORT} [${process.env.NODE_ENV}]`);
});

const shutdown = (signal) => {
  logger.warn(`${signal} received. Initiating graceful shutdown.`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: String(reason) });
  process.exit(1);
});
