const nodemailer = require('nodemailer');

const logger = require('./logger');

const buildTransport = () => {
  const { USER_EMAIL , CLIENT_ID , REFRESH_TOKEN , CLIENT_SECRET } = process.env;

  if (!USER_EMAIL || !CLIENT_ID || !REFRESH_TOKEN || !CLIENT_SECRET) {
    throw new Error('Email service is not fully configured.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: USER_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  });
};

const sendEmail = async ({ email, subject, message, html }) => {
  const transporter = buildTransport();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.USER_EMAIL,
    to: email,
    subject,
    text: message,
    html,
  });

  logger.info(`Email sent to ${email}`);
};

module.exports = sendEmail;
