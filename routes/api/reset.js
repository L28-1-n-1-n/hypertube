const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

router.post(
  '/',

  [
    check('password', 'Password is required').exists(),
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

    const { token, password } = req.body;
    try {
      // let user = await User.findOne({ token: token }).select('-password');
      let user = await User.findOne({ token: token });

      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'Token not valid' }] });
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user in Database
      await user.save();
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
