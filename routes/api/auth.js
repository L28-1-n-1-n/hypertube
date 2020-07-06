const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('passport');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
require('../../config/passport-setup');

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
// @desc    Find user by userID
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

// @route   GET api/auth/github
// @desc    Authenticate user via Github
// @access  Public
router.get('/github', passport.authenticate('github'));

// @route   GET api/auth/github/callback
// @desc    Callback after github authentication
// @access  Public
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: 'http://localhost:3000/',
  }),
  async (req, res) => {
    const payload = {
      user: {
        id: req.user._id,
      },
    };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.redirect('http://localhost:3000/login/' + token);
      }
    );
  }
);

// @route   GET api/auth/fortytwo
// @desc    Authenticate user via fortytwo strategy
// @access  Public
router.get('/fortytwo', passport.authenticate('fortyTwo'));

// @route   GET api/auth/fortytwo/callback
// @desc    Callback after fortytwo authentication
// @access  Public
router.get(
  '/fortytwo/callback',
  passport.authenticate('fortyTwo', {
    failureRedirect: 'http://localhost:3000/',
  }),

  async (req, res) => {
    const payload = {
      user: {
        id: req.user._id,
      },
    };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.redirect('http://localhost:3000/login/' + token);
      }
    );
  }
);

module.exports = router;
