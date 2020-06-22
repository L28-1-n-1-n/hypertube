const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const transporter = require('../../mailer');
const User = require('../../models/User');

// @route   POST api/recuperation
// @desc    Verify user registration token
// @access  Public
router.post(
  '/',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // array of errors
      }

      const { email } = req.body;
      // See if user exists
      let user = await User.findOne({ email: email }).select('-password');
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get payload

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          user.token = token;
          user.save();
          const url = `http://localhost:3000/reset/${token}`;
          const html = `Hello, <br />You've recently asked to recover your Tindurr Account.<br /><br />Please click the link below to enter a new password:<br /><a href=${url}>${url}</a>`;

          var mailOptions = {
            from: 'no-reply.tindurr@outlook.com',
            to: user.email,
            subject: 'Recover your Tindurr Account',
            html: html,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          res.json({ token }); // callback : if no error, get token
        }
      );
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Token not valid' });
      }
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;
