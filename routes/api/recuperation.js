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
        retStatus = 'Error';
        return res.send({
          retStatus: retStatus,
          authorized: false,
          msg: 'Please include a valid email.',
        });
      }

      const { email } = req.body;
      // See if user exists
      let user = await User.findOne({ email: email }).select('-password');
      if (!user) {
        retStatus = 'Error';
        return res.send({
          retStatus: retStatus,
          authorized: false,
          msg: 'An error as occured. Please try again.',
        });
      }

      // Get payload

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          user.token = token;
          user.save();
          const url = `http://localhost:3000/reset/${token}`;
          const html = `Hello, <br />You've recently asked to recover your Hypertube Account.<br /><br />Please click the link below to enter a new password:<br /><a href=${url}>${url}</a>`;

          var mailOptions = {
            from: 'no-reply.tindurr@outlook.com',
            to: user.email,
            subject: 'Recover your Hypertube Account',
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
        retStatus = 'Error';
        return res.send({
          retStatus: retStatus,
          authorized: false,
          msg: 'Invalid token.',
        });
      }
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;
