require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('../config/db');
const { createSingleAdmin } = require('../services/adminService');
const logger = require('../utils/logger');

const requiredEnvVars = ['ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

const createAdmin = async () => {
  if (missingEnvVars.length) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  await connectDB();

  try {
    const admin = await createSingleAdmin({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      phone: process.env.ADMIN_PHONE || '',
      password: process.env.ADMIN_PASSWORD,
    });

    logger.info(`Admin created successfully for ${admin.email}.`);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin()
  .then(() => process.exit(0))
  .catch(async (error) => {
    logger.error(error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  });
