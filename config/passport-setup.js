const passport = require('passport'),
  GitHubStrategy = require('passport-github2').Strategy;
const FortyTwoStrategy = require('passport-42');
const crypto = require('crypto');
const chalk = require('chalk');
const keys = require('./keys');
const User = require('../models/User');

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then((user) => {
      cb(null, user);
    })
    .catch((e) => {
      cb(new Error('Failed to deserialize a user'));
    });
});

passport.use(
  new GitHubStrategy(
    {
      //   clientID: keys.GITHUB.clientID,
      //   clientSecret: keys.GITHUB.clientSecret,
      clientID: keys.githubClientID,
      clientSecret: keys.githubClientSecret,
      callbackURL: 'http://localhost:5000/auth/github/callback',
      // callbackUrl: 'http://localhost:3000',
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.yellow(profile));
      console.log(chalk.yellow(JSON.stringify(profile)));
      //   console.log(chalk.yellow(profile));

      const currentUser = await User.findOne({
        githubId: profile._json.id_str,
      });
      if (!currentUser) {
        const newUser = await new User({
          username: profile.username,
          lastname: profile.displayName,
          emailAddress: profile.emails[0].value,
          //   avatar: profile.photos[0].value,
          password: 'salut',
          githubId: profile._json.id_str,
        });
        newUser.save();
        if (newUser) {
          cb(null, newUser);
        }
      }
      cb(null, currentUser);
    }
  )
);

// passport.use(
//   'fortyTwo',
//   new FortyTwoStrategy(
//     {
//       clientID: keys.FORTYTWO.clientID,
//       clientSecret: keys.FORTYTWO.clientSecret,
//       callbackURL: 'http://localhost:5000/api/auth/fortytwo/callback',
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       console.log(chalk.yellow(profile));
//       const currentUser = await User.findOne({
//         fortyTwo_id: profile.id,
//       });
//       if (!currentUser) {
//         const newUser = await new User({
//           firstName: profile.name.givenName,
//           lastName: profile.name.familyName,
//           // picture: profile.photos[0].value,
//           userName: profile.username + Math.floor(Math.random() * 100),
//           fortytwo_id: profile.id,
//         }).save();

//         if (newUser) {
//           cb(null, newUser);
//         }
//       } else {
//         cb(null, currentUser);
//       }
//     }
//   )
// );

passport.use(
  'fortyTwo',
  new FortyTwoStrategy(
    {
      clientID: keys.fortyTwoClientID,
      clientSecret: keys.fortyTwoClientSecret,
      // callbackURL: 'http://localhost:1337/api/v1/auth/42/callback',
      callbackURL: `http://localhost:5000/api/auth/fortytwo/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      // console.log(profile);

      const currentUser = await User.findOne({
        fortyTwoId: profile.id,
      });
      let userFields = {
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        // picture: profile.photos[0].value,
        username: profile.username + Math.floor(Math.random() * 100),
        email: profile.emails[0].value,
        password: crypto.randomBytes(8).toString('hex'),
        fortyTwoId: profile.id,
        imageUrl: profile.photos[0].value,
      };
      console.log(userFields);
      if (!currentUser) {
        const newUser = await new User({
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          // picture: profile.photos[0].value,
          username: profile.username + Math.floor(Math.random() * 100),
          email: profile.emails[0].value,
          password: crypto.randomBytes(8).toString('hex'),
          fortyTwoId: profile.id,
          imageUrl: profile.photos[0].value,
        });
        newUser.save();
        console.log(newUser);

        if (newUser) {
          cb(null, newUser);
        }
      } else {
        cb(null, currentUser);
      }
    }
  )
);
