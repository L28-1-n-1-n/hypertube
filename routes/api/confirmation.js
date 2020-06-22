const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route   POST api/confirmation
// @desc    Verify user registration token
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Token not valid' });
    }
    if (!user.confirmed) {
      user.confirmed = true;
      await user.save();
      res.json(user);
    } else {
      return res.status(400).json({
        errors: [
          {
            msg: 'This email address has already been confirmed.',
          },
        ],
      });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Token not valid' });
    }
    res.status(500).send('Server Error');
  }
});
module.exports = router;
