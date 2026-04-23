const mongoose = require('mongoose');

const logger = require('../utils/logger');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_NAME || undefined,
  });

  logger.info(`MongoDB connected: ${connection.connection.host}`);

  return connection;
};

module.exports = connectDB;
