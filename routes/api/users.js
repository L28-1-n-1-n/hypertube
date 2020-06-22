const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const transporter = require('../../mailer');
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register users
// @access  Public
router.post(
  '/',
  [
    check('firstname', 'Firstname is required').not().isEmpty(),
    check('lastname', 'Lastname is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'firstname',
      'Please enter a firstname less than 15 characters'
    ).isLength({ max: 15 }),
    check(
      'lastname',
      'Please enter a lastname less than 15 characters'
    ).isLength({ max: 15 }),
    check(
      'username',
      'Please enter a username less than 15 characters'
    ).isLength({ max: 15 }),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // array of errors
    }

    const { firstname, lastname, username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] }); // array of errors
      }
      user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'Username taken. Please choose another one.' }],
        }); // array of errors
      }

      // Create User
      user = new User({
        firstname,
        lastname,
        username,
        email,
        password,
      });

      // Add randomness by genSalt using bcrypt, and then encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user in Database
      await user.save();

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
          user.token = token;
          user.save();
          const url = `http://localhost:3000/confirmation/${token}`;
          const html = `Hello, <br />Thank you for signing up for Tindurr.<br /><br />Please click the link below to activate your account:<br /><a href=${url}>${url}</a>`;

          var mailOptions = {
            from: 'no-reply.tindurr@outlook.com',
            to: user.email,
            subject: 'Confirm your Tindurr Account',
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
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/users/:id
// @desc    Create or update user's profile
// @access  Private
router.post(
  '/:id',
  [
    auth,
    [
      check('firstname', 'Firstname is required').not().isEmpty(),
      check('lastname', 'Lastname is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('firstname', 'Firstname too long').isLength({ max: 15 }),
      check('lastname', 'Lastname too long').isLength({ max: 15 }),
      check('gender', 'Please select a gender').isIn([
        'Male',
        'Female',
        'Non-Binary',
      ]),
      check('bday', 'Please enter your birthdate').not().isEmpty(),
      check('bday.day', 'Please enter valid birthday')
        .not()
        .isIn(['Invalid date', 'undefined', NaN]),

      check(
        'interestedGender',
        'Select the gender/s/ you are interested in'
      ).isIn(['Male', 'Female', 'Both']),
      check('bio', 'Please fill in Short Bio').not().isEmpty(),
      check('tags', 'Please enter a list of interests separated by commas')
        .not()
        .isEmpty(),
      check('bio', 'Bio too long').isLength({ max: 200 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstname, lastname, email } = req.body;
    const userFields = {
      _id: req.user.id,
      firstname: firstname,
      lastname: lastname,
      email: email,
    };

    try {
      let user = await User.findOne({ _id: req.user.id }).select(
        '-username -password'
      );

      if (user) {
        user = await User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: userFields },
          { new: true }
        );
        return res.json(user);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route DELETE api/users/notifications/:id
// @desc Delete notifications after they are read
// @access Private

router.delete('/notifications/:id', auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id).select('-username -password');

    if (user) {
      user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { notifications: [] } }
      );
      return res.json(user);
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Notifications not found ' });
    }
    res.status(500).send('Server Error');
  }
});
module.exports = router;
