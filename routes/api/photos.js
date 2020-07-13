const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Photo = require('../../models/Photo');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

var UserList = require('../../config/userlist');
var userlist = UserList.userlist;

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(
      __dirname,
      '..',
      '..',
      'client',
      'public',
      'uploads'
    );
    // fs.mkdirSync(uploadsDir)
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originlaname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1000 * 1000 }, //5MB per photo
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
});
// unfortunately this does not work
var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb('Invalid file type. Only JPEG, JPG and PNG file are allowed.');
  }
};

// @route   GET api/photos
// @desc    Get all photos
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate('profile', [
        '_id',
        'user',
        'location',
        'bday',
        'bio',
        'gender',
        'interestedGender',
        'tags',
        'fame',
        'likes',
        'likedBy',
        'checkedOut',
        'checkedOutBy',
      ])
      .sort({ date: -1 }); // latest photo first

    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/photos/filteredMatches
// @desc    Get profile pics of profiles that fit the user's criteria
// @access  Private
router.get('/filteredMatches', auth, async (req, res) => {
  try {
    const photos = await Photo.find({ isProfilePic: true }).populate(
      'profile',
      [
        '_id',
        'user',
        'location',
        'bday',
        'bio',
        'gender',
        'interestedGender',
        'tags',
        'fame',
        'distance',
        'maxCommonTags',
        'likes',
        'likedBy',
        'checkedOut',
        'checkedOutBy',
        'onlineNow',
        'lastOnline',
      ]
    );
    const myProfile = await Profile.findOne({ user: req.user.id });

    if (!myProfile) {
      return res.status(400).json({ msg: ' Profile not found' });
    }

    //filter age
    const findAge = (photo) => {
      let age;
      var dateObj = new Date();
      age = dateObj.getUTCFullYear() - photo.profile.bday.year;
      var month = dateObj.getUTCMonth() + 1 - photo.profile.bday.month; //months from 1-12
      var day = dateObj.getUTCDate() - photo.profile.bday.day;
      return (age = month < 0 ? age - 1 : day < 0 ? age - 1 : age);
    };

    let ProfilePics;

    if (!myProfile.blocked && !myProfile.blockedBy) {
      ProfilePics = photos;
    }
    // Remove blocked profiles
    if (photos && myProfile.blocked) {
      ProfilePics = photos.filter(function (e) {
        return !myProfile.blocked.some(function (s) {
          return s.user.toString() === e.user._id.toString();
        });
      });
    }

    // Remove possibility to see profiles of ppl who has blocked this user
    if (photos && myProfile.blockedBy) {
      ProfilePics = ProfilePics.filter(function (e) {
        return !myProfile.blockedBy.some(function (s) {
          return s.user.toString() === e.user._id.toString();
        });
      });
    }

    if (ProfilePics && myProfile) {
      if (myProfile.interestedGender == 'Female') {
        ProfilePics = ProfilePics.filter(
          (photo) =>
            photo.profile.gender !== 'Male' &&
            (photo.profile.interestedGender == 'Both' ||
              photo.profile.interestedGender == myProfile.gender)
        );
      } else if (myProfile.interestedGender == 'Male') {
        ProfilePics = ProfilePics.filter(
          (photo) =>
            photo.profile.gender !== 'Female' &&
            (photo.profile.interestedGender == 'Both' ||
              photo.profile.interestedGender == myProfile.gender)
        );
      }
    }
    // make sure the user's own profile does not show up in the matches
    if (ProfilePics && myProfile) {
      ProfilePics = ProfilePics.filter(
        (photo) =>
          photo.profile &&
          photo.isProfilePic == true &&
          photo.profile._id !== myProfile._id
      );
    }

    // match age range
    if (ProfilePics && (myProfile.ageStarts || myProfile.ageEnds)) {
      ProfilePics.forEach(function (photo) {
        if (photo.profile.bday) {
          photo.profile.age = findAge(photo);
        }
      });

      ProfilePics = ProfilePics.filter(
        (photo) =>
          photo.profile.age &&
          photo.profile.age >= myProfile.ageStarts &&
          photo.profile.age <= myProfile.ageEnds
      );
    }

    // sort by age from young to old
    ProfilePics.sort((a, b) => (a.profile.age > b.profile.age ? 1 : -1));

    // match fame range
    if (ProfilePics && (myProfile.fameStarts || myProfile.fameEnds)) {
      ProfilePics.forEach(function (photo) {
        if (photo.profile.likedBy && photo.profile.checkedOutBy) {
          photo.profile.fame =
            photo.profile.likedBy.length + photo.profile.checkedOutBy.length;
        }
      });
      ProfilePics = ProfilePics.filter(
        (photo) =>
          photo.profile.fame &&
          photo.profile.fame >= myProfile.fameStarts &&
          photo.profile.fame <= myProfile.fameEnds
      );
    }
    // sort by fame from high to low
    ProfilePics.sort((a, b) => (a.profile.fame > b.profile.fame ? -1 : 1));

    if (ProfilePics) {
      ProfilePics.forEach(function (photo) {
        if (photo.profile.likedBy && photo.profile.checkedOutBy) {
          photo.profile.fame =
            photo.profile.likedBy.length + photo.profile.checkedOutBy.length;
        }
      });
    }

    // match location by name
    if (ProfilePics && myProfile.preferredLocation) {
      ProfilePics = ProfilePics.filter(
        (photo) =>
          photo.profile.location.city.replace(/\s/g, '').toLowerCase() ==
          myProfile.preferredLocation.replace(/\s/g, '').toLowerCase()
      );
    }
    function distance(lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295; // Math.PI / 180
      var c = Math.cos;
      var a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

    // match desired distance
    if (ProfilePics && myProfile.preferredDistance) {
      ProfilePics.forEach(function (photo) {
        if (
          photo.profile.location.latitude &&
          photo.profile.location.latitude
        ) {
          photo.profile.distance = distance(
            myProfile.location.latitude,
            myProfile.location.longitude,
            photo.profile.location.latitude,
            photo.profile.location.longitude
          );
        }
      });
      ProfilePics = ProfilePics.filter(
        (photo) =>
          photo.profile.distance &&
          photo.profile.distance <= myProfile.preferredDistance
      );
    }
    // sort by distance from low to high
    ProfilePics.sort((a, b) =>
      a.profile.distance > b.profile.distance ? 1 : -1
    );

    if (ProfilePics) {
      ProfilePics.forEach(function (photo) {
        if (
          userlist.some(function (s) {
            return s.user.toString() === photo.profile.user.toString();
          })
        ) {
          photo.profile.onlineNow = 'Yes';
        }
      });
    }

    // match Tags and return new array if tags match
    if (myProfile.preferredTags.length !== 0) {
      var filtered_array = [];
      ProfilePics.forEach(function (photo) {
        photo.profile.maxCommonTags = photo.profile.tags.filter((value) =>
          myProfile.preferredTags.includes(value)
        ).length;
        if (photo.profile.maxCommonTags !== 0) {
          filtered_array.push(photo);
        }
      });
      // sort by number of common tags from high to low
      filtered_array.sort((a, b) =>
        a.profile.maxCommonTags > b.profile.maxCommonTags ? -1 : 1
      );
      return res.json(filtered_array);
    }

    res.json(ProfilePics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/photos/me
// @desc    Get current user's photos by his/her userid
// @access  Private
router.get('/me', auth, async (req, res) => {
  // endpoint is '/me', not '/'
  try {
    // find user by its objectid
    const photo = await Photo.find({
      user: req.user.id,
    });

    if (!photo) {
      return res
        .status(400)
        .json({ msg: ' No photos found. Try uploading some !' });
    }
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/photos/${userId}/all
// @desc    Get current user's profile pic by his/her userid
// @access  Private
router.get('/:id/all', auth, async (req, res) => {
  try {
    // find user by its objectid
    const photos = await Photo.find({
      user: req.params.id,
    });

    if (!photos) {
      return res
        .status(400)
        .json({ msg: ' No photos found. Try uploading some !' });
    }
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/photos/recentPhotos
// @desc    Get profile pics of recently checked out  profiles
// @access  Private
router.get('/recentPhotos', auth, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user.id });
    if (!myProfile) {
      return res.status(400).json({ msg: ' Profile not found' });
    }
    const profile_list = myProfile.checkedOut;
    const photos = await Photo.find({ isProfilePic: true }).populate(
      'profile',
      [
        '_id',
        'user',
        'location',
        'bday',
        'bio',
        'gender',
        'interestedGender',
        'tags',
        'fame',
        'distance',
        'maxCommonTags',
        'likes',
        'likedBy',
        'checkedOut',
        'checkedOutBy',
      ]
    );

    if (profile_list.length !== 0) {
      var filtered_array = [];
      photos.forEach(function (photo) {
        if (
          myProfile.checkedOut.filter(
            (item) => item.user.toString() === photo.user.toString()
          ).length !== 0
        ) {
          filtered_array.push(photo);
        }
      });

      return res.json(filtered_array);
    }
    // res.json(ProfilePics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/photos/connectedPhotos
// @desc    Get profile pics of connected profiles
// @access  Private
router.get('/connectedPhotos', auth, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user.id });
    if (!myProfile) {
      return res.status(400).json({ msg: ' Profile not found' });
    }
    const profile_list = myProfile.correspondances;
    const photos = await Photo.find({ isProfilePic: true }).populate(
      'profile',
      [
        '_id',
        'user',
        'location',
        'bday',
        'bio',
        'gender',
        'interestedGender',
        'tags',
        'fame',
        'distance',
        'maxCommonTags',
        'likes',
        'likedBy',
        'checkedOut',
        'checkedOutBy',
      ]
    );

    if (myProfile.correspondances.length !== 0) {
      var filtered_array = [];
      photos.forEach(function (photo) {
        if (
          myProfile.correspondances.filter(
            (item) => item.user.toString() === photo.user._id.toString()
          ).length !== 0
        ) {
          filtered_array.push(photo);
        }
      });

      return res.json(filtered_array);
    }
    // res.json(ProfilePics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/photo/${userId}/profilepic
// @desc    Get current user's profile pic by his/her userid
// @access  Private
router.get('/:id/profilepic', auth, async (req, res) => {
  // endpoint is '/me', not '/'
  try {
    // find user by its objectid
    const photo = await Photo.find({
      user: req.params.id,
    });

    if (!photo) {
      return res
        .status(400)
        .json({ msg: ' No photos found. Try uploading some !' });
    }
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// const io = require('../../server').io;
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (req.files === null) {
    retStatus = 'Error';
    return res.send({
      retStatus: retStatus,
      authorized: false,
      msg: 'No file uploaded.',
    })
  }
  const file = req.files.file;

  const uploadsDir = path.join(
    __dirname,
    '..',
    '..',
    'client',
    'public',
    'uploads'
  );
  try {
    file.mv(path.resolve(uploadsDir, file.name), async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      } 
      const userFields = {
        _id: req.user.id,
        fileName: file.name,
        filePath: `/uploads/${file.name}`,
        data: fs.readFileSync(path.resolve(uploadsDir, file.name)),
      };
      let user = await User.findOne({ _id: req.user.id }).select(
        '-username -password'
      );
      if (user) {
        user = await User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: userFields },
          { new: true },
        );
      }
      return res.json(user);
    });
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
});

// @route PUT api/photos/like/:id
// @desc Like a photo
// @access Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (
      photo.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Photo already liked' });
    }
    // if the logged in user has not liked the photo, add the user to the top of the list of people who have liked the photo
    const addLikeToPhoto = photo.likes.unshift({ user: req.user.id });

    await photo.save();

    const myProfile = await Profile.findOne({ user: req.user.id });

    if (myProfile.likes.length == 0) {
      const thisUserLikes = await myProfile.updateOne({
        $push: {
          likes: { user: photo.user._id },
        },
      });

      return res.json(photo.likes);
    } else if (
      myProfile.likes.filter((entry) => entry.user.toString() == photo.user._id)
        .length == 0
    ) {
      const thisUserLikes = await myProfile.updateOne({
        $push: {
          likes: { user: photo.user._id },
        },
      });

      return res.json(photo.likes);
    }

    res.json(photo.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/photos/likedby/:id
// @desc Like a photo
// @access Private

router.put('/likedby/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    const target_profile = await Profile.findById(photo.profile.toString());
    const target_user = await User.findById(photo.user.toString());
    const likedBy_user = await User.findById(req.user.id);
    const myProfile = await Profile.findOne({ user: req.user.id });

    if (!target_profile || !myProfile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    if (!target_user || !likedBy_user) {
      return res.status(400).json({ msg: 'User account not found' });
    }

    const notify_user = await target_user.updateOne({
      $push: {
        notifications: {
          msg: `Your photo is liked by ${likedBy_user.firstname}`,
          user: req.user.id,
        },
      },
    });

    if (photo.likes.length == 0 || target_profile.likedBy.length == 0) {
      const profile_liked_by = await target_profile.updateOne({
        $push: {
          likedBy: { user: req.user.id },
        },
      });

      if (
        target_profile.likes.filter(
          (like) => like.user.toString() === req.user.id
        ).length !== 0
      ) {
        if (
          target_profile.correspondances.filter(
            (item) => item.user.toString() === req.user.id
          ).length === 0
        ) {
          await target_profile.updateOne({
            $push: {
              correspondances: {
                user: req.user.id,
                name: likedBy_user.firstname,
              },
            },
          });

          await myProfile.updateOne({
            $push: {
              correspondances: {
                user: target_user._id,
                name: target_user.firstname,
              },
            },
          });

          await target_user.updateOne({
            $push: {
              notifications: {
                msg: `Your connected with ${likedBy_user.firstname}`,
                user: req.user.id,
              },
            },
          });
        }
      }

      return res.status(200).json({ profile_liked_by });
    } else if (
      photo.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0 &&
      target_profile.likedBy.filter(
        (entry) => entry.user.toString() === req.user.id
      ).length === 0
    ) {
      const profile_liked_by = await target_profile.updateOne({
        $push: {
          likedBy: { user: req.user.id },
        },
      });

      if (
        target_profile.likes.filter(
          (like) => like.user.toString() === req.user.id
        ).length !== 0
      ) {
        if (
          target_profile.correspondances.filter(
            (item) => item.user.toString() === req.user.id
          ).length === 0
        ) {
          await target_profile.updateOne({
            $push: {
              correspondances: {
                user: req.user.id,
                name: likedBy_user.firstname,
              },
            },
          });

          await myProfile.updateOne({
            $push: {
              correspondances: {
                user: target_user._id,
                name: target_user.firstname,
              },
            },
          });
          await likedBy_user.updateOne({
            $push: {
              notifications: {
                msg: `Your connected with ${target_user.firstname}`,
                user: req.user.id,
              },
            },
          });
          await target_user.updateOne({
            $push: {
              notifications: [
                {
                  msg: `Your connected with ${likedBy_user.firstname}`,
                  user: req.user.id,
                },
              ],
            },
          });
        }
      }

      return res.status(200).json({ profile_liked_by });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/photos/unlike/:id
// @desc Unlike a photo
// @access Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    // Check if the photo has already been liked by the login user
    // .filter returns an array of strings where the username of the people who liked the photo equals to the loggedin user
    // if this length is not zero, the current logged in user has liked the photo already
    if (
      photo.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Photo not yet liked' });
    }
    // Get remove index
    const removeIndex = photo.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    photo.likes.splice(removeIndex, 1);

    await photo.save();
    res.json(photo.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/photos/:id
// @desc Delete a photo
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found ' });
    }
    // Check user
    if (photo.user.toString() !== req.user.id) {
      // toString() required since photo.user is an object, but req.user.id is a string
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await photo.remove();
    res.json({ msg: 'Photo removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Photo not found ' });
    }
    res.status(500).send('Server Error');
  }
});

// @route PUT api/photos/isProfilePic/:id
// @desc Make a photo profilepic
// @access Private

router.put('/isProfilePic/:id', auth, async (req, res) => {
  try {
    const photos = await Photo.find({
      user: req.user.id,
    });
    if (!photos) {
      return res
        .status(400)
        .json({ msg: ' No photos found. Try uploading some !' });
    }

    photos.map(async (photo) => {
      photo._id == req.params.id
        ? (photo.isProfilePic = true)
        : (photo.isProfilePic = false);
      await photo.save();
      res.json(photo.isProfiePic);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT /api/photos/clicked/${targetID}/${myID}
// @desc Adding to database of target user that the logged-in user has checked out his/her profile
// @access Private
router.put(`/clicked/:targetProfileID/:myUserID`, auth, async (req, res) => {
  try {
    const target_profile = await Profile.findById(req.params.targetProfileID);
    const thisProfileChecks = await Profile.findOne({
      user: req.params.myUserID,
    });

    if (!target_profile || !thisProfileChecks) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    const target_user = await User.findById(target_profile.user.toString());
    const checkedOutBy_user = await User.findById(req.params.myUserID);

    if (!target_user || !checkedOutBy_user) {
      return res.status(400).json({ msg: 'User account not found' });
    }

    if (thisProfileChecks.checkedOut.length == 0) {
      const thisUserChecksOut = await thisProfileChecks.updateOne({
        $push: {
          checkedOut: { user: target_user._id },
        },
      });
    } else if (
      thisProfileChecks.checkedOut.filter(
        (entry) => entry.user.toString() == target_user._id
      ).length == 0
    ) {
      const thisUserChecksOut = await thisProfileChecks.updateOne({
        $push: {
          checkedOut: { user: target_user._id },
        },
      });
    }

    const notify_user = await target_user.updateOne({
      $push: {
        notifications: {
          msg: `${checkedOutBy_user.firstname} checked out your profile.`,
          user: req.user.id,
        },
      },
    });

    if (target_profile.checkedOutBy.length == 0) {
      const profile_checkedOutBy = await target_profile.updateOne({
        $push: {
          checkedOutBy: { user: req.params.myUserID },
        },
      });
      return res.status(200).json({ profile_checkedOutBy, notify_user });
    } else if (
      target_profile.checkedOutBy.filter(
        (entry) => entry.user.toString() === req.params.myUserID
      ).length === 0
    ) {
      const profile_checkedOutBy = await target_profile.updateOne({
        $push: {
          checkedOutBy: { user: req.params.myUserID },
        },
      });
      return res.status(200).json({ profile_checkedOutBy, notify_user });
    }
    res.json(notify_user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
