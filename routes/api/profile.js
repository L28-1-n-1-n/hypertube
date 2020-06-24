const express = require('express');

const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Photo = require('../../models/Photo');
const publicIp = require('public-ip');
const ipLocation = require('iplocation');
var UserList = require('../../config/userlist');
var userlist = UserList.userlist;

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  // endpoint is '/me', not '/'
  try {
    // find user by its objectid
    // populate the user with firstname and lastname
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['firstname', 'lastname']);
    console.log('USERLIST', userlist);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: ' There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('lang', 'Lang is required').isIn([
        'fr',
        'en',
        'es',
      ]),
      check('username', 'Please fill in first name').not().isEmpty(),
      check('firstname', 'Please fill in first name').not().isEmpty(),
      check('lastname', 'Please fill in last name').not().isEmpty(),
      check('email', 'Please ensure email is in correct format').isEmail(),
      check('firstname', 'First name is too long').isLength({ max: 15 }),
      check('lastname', 'Last name is too long').isLength({ max: 15 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
    } = req.body;

    const profileFields = {
      user: req.user.id,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      let user = await User.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // If profile not found, create new one
      profile = new Profile(profileFields); // profile is an instance of the model Profile, profileFields is ProfileSchema

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'firstname',
      'lastname',
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id // get user by userid, not profileid
// @desc    Get profile by user ID
// @access  Private

router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['firstname', 'lastname']);
    if (!profile)
      return res.status(400).json({ msg: 'There is no profile for this user' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' }); // display message for non-valid userid
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user, photos
// @access  Private

router.delete('/', auth, async (req, res) => {
  try {
    // Remove user photos before removing their profile and account
    await Photo.deleteMany({ user: req.user.id });

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  '/matchpreferences',
  auth,

  async (req, res) => {
    const {
      ageStarts,
      ageEnds,
      preferredTags,
      preferredLocation,
      preferredDistance,
      fameStarts,
      fameEnds,
    } = req.body;

    const preferenceFields = {
      user: req.user.id,
      ageStarts,
      ageEnds,
      preferredLocation,
      preferredDistance,
      fameStarts,
      fameEnds,
      preferredTags: Array.isArray(preferredTags)
        ? preferredTags
        : preferredTags.split(',').map((tag) => ' ' + tag.trim()),
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: preferenceFields },
          { new: true }
        );
        return res.json(profile);
      }

      // If profile not found, create new one
      profile = new Profile(preferenceFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/disconnect/:id
// @desc    Disconnect with a user
// @access  Private

router.post('/disconnect/:id', auth, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user.id });

    const disconnectProfile = await Profile.findOne({
      user: req.params.id.toString(),
    });

    await myProfile.updateOne(
      {
        $pull: {
          likes: {
            user: req.params.id,
          },
          correspondances: {
            user: req.params.id,
          },
          likedBy: {
            user: req.params.id,
          },
        },
      },
      function (err, data) {
        console.log(err, data);
      }
    );

    await disconnectProfile.updateOne(
      {
        $pull: {
          likes: {
            user: req.user.id,
          },
          correspondances: {
            user: req.user.id,
          },
          likedBy: {
            user: req.user.id,
          },
        },
      },
      function (err, data) {
        console.log(err, data);
      }
    );
    res.json(myProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/block/:id
// @desc    Block a user
// @access  Private

router.post('/block/:id', auth, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user.id });
    const blockProfile = await Profile.findOne({
      user: req.params.id.toString(),
    });

    await myProfile.updateOne({
      $pull: {
        likes: {
          user: req.params.id,
        },
        correspondances: {
          user: req.params.id,
        },
        likedBy: {
          user: req.params.id,
        },
      },
    });

    await myProfile.updateOne({
      $push: {
        blocked: {
          user: req.params.id,
        },
      },
    });

    await blockProfile.updateOne({
      $push: {
        blockedBy: {
          user: req.user.id,
        },
      },
    });

    await blockProfile.updateOne({
      $pull: {
        likes: {
          user: req.user.id,
        },
        correspondances: {
          user: req.user.id,
        },
        likedBy: {
          user: req.user.id,
        },
      },
    });
    res.json(myProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/reportfake/:id
// @desc    Report a user as fake
// @access  Private

router.post('/reportfake/:id', auth, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user.id });
    const targetProfile = await Profile.findOne({
      user: req.params.id.toString(),
    });

    await targetProfile.updateOne({
      $push: {
        fakeVote: {
          user: req.user.id,
        },
      },
    });

    res.json(myProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
