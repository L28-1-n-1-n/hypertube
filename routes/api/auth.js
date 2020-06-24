const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const nodemailer = require('nodemailer');
const Profile = require('../../models/Profile');

const MAILER_USER = config.get('mailerUser');
const MAILER_PASS = config.get('mailerPass');
const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

// @route   GET api/auth
// @desc    TEST route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const profile = await Profile.findOne({ user: req.user.id });
    const logon_time = new Date();
    if (profile) {
      profile.updateOne({ lastOnline: logon_time });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('username', 'Please include a valid Username').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // array of errors
    }
    // See if user exists
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] }); // array of errors
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] }); // array of errors
      }

      // Get payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Use payload and token to sign token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // callback : if no error, get token
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
