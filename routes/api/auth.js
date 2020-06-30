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
  console.log('/api/auth route is hit');
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

// router.all('*', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', '*');
//   next();
// });
// @route   GET api/auth/auth/github
// @desc    Github OAuth
// @access  Public
// router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/github',
  // auth,
  passport.authenticate(
    'github'
    // {successRedirect: 'http://localhost:3000',
    // failureRedirect: 'http://localhost:3000/login',}
  )
  // function (req, res) {
  //   res.redirect('/');
  // }
);

// router.get(
//   '/auth/auth/github',
//   passport.authenticate('github', { email: `zto2.71828@gmail.com` })
// );
// router.get('/auth/github', () => {
//   console.log('back reached');
// });

// router.get('/github', passportSetup, (req, res) => {
//   console.log('back reached');
//   try {
//     // const user = await User.findById(req.user.id).select('-password');
//     // const profile = await Profile.findOne({ user: req.user.id });
//     // const logon_time = new Date();
//     // if (profile) {
//     //   profile.updateOne({ lastOnline: logon_time });
//     // }
//     // res.json(user);
//     console.log(passportSetup);
//     console.log('lol');
//     // const response = await passport.authenticate('github')(req, res);
//     // console.log(res);
//     // console.log(response);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// router.get('/github', async (req, res) => {
//   console.log('back reached');
//   try {
//     // const user = await User.findById(req.user.id).select('-password');
//     // const profile = await Profile.findOne({ user: req.user.id });
//     // const logon_time = new Date();
//     // if (profile) {
//     //   profile.updateOne({ lastOnline: logon_time });
//     // }
//     // res.json(user);
//     console.log(passportSetup);
//     const response = await passport.authenticate('github')(req, res);
//     console.log(res);
//     console.log(response);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// router.post(
//   '/auth/github',
//   // wrap passport.authenticate call in a middleware function
//   function (req, res, next) {
//     // call passport authentication passing the "local" strategy name and a callback function
//     console.log('back reached');
//     passport.authenticate('github', function (error, user, info) {
//       // this will execute in any case, even if a passport strategy will find an error
//       // log everything to console
//       console.log('yolo');
//       console.log(error);
//       console.log(user);
//       console.log(info);

//       if (error) {
//         res.status(401).send(error);
//       } else if (!user) {
//         res.status(401).send(info);
//       } else {
//         next();
//       }

//       res.status(401).send(info);
//     })(req, res);
//   },

//   // function to call once successfully authenticated
//   function (req, res) {
//     res.status(200).send('logged in!');
//   }
// );

// router.get('/auth/github', () => {
//   console.log('back reached');
//   passport.authenticate('github', {
//     failureRedirect: 'http://localhost:3000/login',
//   }),
//     function (req, res) {
//       res.redirect('/');
//     };
// });
// router.get('/auth/github', (request, res) => {
//   console.log('we are here');
//   request(
//     {
//       url:
//         'https://github.com/login/oauth/authorize?response_type=code&client_id=9c4ca4e91c36b7692f63',
//     },
//     (error, response, body) => {
//       if (error || response.statusCode !== 200) {
//         return res.status(500).json({ type: 'error', message: err.message });
//       }

//       res.json(JSON.parse(body));
//     }
//   );
// });
// router.get(
//   '/auth/github/redirect',
//   passport.authenticate('github', {
//     successRedirect: 'http://localhost:3000',
//     failureRedirect: 'http://localhost:3000/player',
//   })
// );
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  // passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log('yaay');
    res.redirect('/');
  }
);

router.get('/fortytwo', passport.authenticate('fortyTwo'));
router.get(
  '/fortytwo/callback',
  passport.authenticate('fortyTwo', {
    // successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/?message=oauth_fail',
  }),
  // async function (req, res) {
  //   try {
  //     const id = req.user;
  //     console.log(req);
  //     console.log(res);
  //     console.log('id in router is', id);
  //     console.log(accessToken);
  //     let newUser = await User.findOne({ _id: req.user.id });
  //     if (!newUser) {
  //       console.log('unable to find new user');
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   // res.send('hello');
  //   // console.log(req);
  //   // console.log(res);
  //   // const token = jwt.sign({ id }, jwtSecret.secret);
  //   // res.redirect("http://localhost:3000/login?accessToken=" + token);
  // }
  async (req, res) => {
    // const id = req.user.dataValues.id;
    console.log('req is ', req.user);
    console.log(req.user._id);
    console.log(req.user.firstname);
    console.log(req.user.lastname);
    console.log(req.user.email);
    console.log(req.user.password);
    console.log(req.user.fortyTwoId);
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
        console.log('generated token is', token);
        res.redirect('http://localhost:3000/login/' + token);
        // Need to make html page to grab the access Token as match.params.accessToken,
        // then use axios to update the state

        // res.json({ token }); // callback : if no error, get token
      }
    );
  }
);

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', function (err, user, info) {
    console.log(err, user, info);
  })
  // passport.authenticate('facebook', {
  //   failureRedirect: 'http://localhost:3000/login',
  // }),
  // async (req, res) => {
  //   const id = req.user.dataValues.id;
  //   console.log(res);
  //   // const token = jwt.sign({ id }, jwtSecret.secret);
  //   // res.redirect("http://localhost:3000/login?accessToken=" + token);
  // }
);
// router.get('/facebook/callback', () => {
//   console.log('Hello Lola');
// });
module.exports = router;
