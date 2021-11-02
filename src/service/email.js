const nodemailer = require('nodemailer');
const { authEmail } = require('../credentialsNodeMail');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: authEmail.email,
    pass: authEmail.pass,
  },
});
exports.transporter = transporter;
