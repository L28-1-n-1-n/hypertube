const config = require('config');
const nodemailer = require('nodemailer');
const MAILER_USER = config.get('mailerUser');
const MAILER_PASS = config.get('mailerPass');
const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

module.exports = transporter;
