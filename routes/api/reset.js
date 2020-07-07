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
      retStatus = 'Error';
      return res.send({
        retStatus: retStatus,
        authorized: false,
        msg: 'A password is required.',
      })
    }

    const { token, password } = req.body;
    try {
      // let user = await User.findOne({ token: token }).select('-password');
      let user = await User.findOne({ token: token });

      if (!user) {
        retStatus = 'Error';
        return res.send({
          retStatus: retStatus,
          authorized: false,
          msg: 'An error as occured. Please try again.',
        })
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user in Database
      await user.save();
      return res.json(user)
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        retStatus = 'Error';
        return res.send({
          retStatus: retStatus,
          authorized: false,
          msg: 'An error as occured. Please try again.',
        })
      }
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;
