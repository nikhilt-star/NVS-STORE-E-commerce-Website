require('dotenv').config();

const mongoose = require('mongoose');

const app = require('./app');
const connectDB = require('./config/db');
const { closeRedis, connectRedis } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = Number(process.env.PORT) || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();

    try {
      await connectRedis();
    } catch (error) {
      logger.warn(`Redis connection skipped: ${error.message}`);
    }

    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown.`);

  if (!server) {
    process.exit(1);
  }

  server.close(async () => {
    await mongoose.connection.close();
    await closeRedis();
    logger.info('HTTP server and database connections closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled rejection: ${error.message}`);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
