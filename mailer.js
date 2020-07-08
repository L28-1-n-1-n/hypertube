const nodemailer = require('nodemailer');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: process.env.mailerUser,
    pass: process.env.mailerPass,
  },
});

module.exports = transporter;
