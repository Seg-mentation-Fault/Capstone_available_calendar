const nodemailer = require('nodemailer');
/* eslint-disable */
const { authEmail } = require('/credentials/credentialsNodeMail');
/* eslint-disable */

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: authEmail.email,
    pass: authEmail.pass,
  },
});
exports.transporter = transporter;
