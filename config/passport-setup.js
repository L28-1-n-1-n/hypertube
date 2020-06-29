const passport = require('passport'),
  GitHubStrategy = require('passport-github2').Strategy;
const FortyTwoStrategy = require('passport-42');

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
      callbackUrl: 'http://localhost:5000/auth/auth/github/callback',
      // callbackUrl: 'http://localhost:3000',
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.yellow(profile));
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
        }).save();

        if (newUser) {
          cb(null, newUser);
        }
      }
      cb(null, currentUser);
    }
  )
);

passport.use(
  'fortyTwo',
  new FortyTwoStrategy(
    {
      // clientID:
      //   '34163cd6c87885d9996267d8e9777e2ae0b8eb83e0bcdc89b0fc3976169fb918',
      // clientSecret:
      //   '83d56a400a0d29c394d12c53334238b5505742f7cfe23606d7fb868272c2416f',
      clientID: keys.fortyTwoClientID,
      clientSecret: keys.fortyTwoClientSecret,
      // callbackURL: 'http://localhost:1337/api/v1/auth/42/callback',
      callbackUrl: `http://localhost:5000/api/auth/fortytwo/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.yellow(profile));
      const currentUser = await User.findOne({
        fortyTwo_id: profile.id,
      });
      if (!currentUser) {
        const newUser = await new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          picture: profile.photos[0].value,
          userName: profile.username + Math.floor(Math.random() * 100),
          fortytwo_id: profile.id,
        }).save();

        if (newUser) {
          cb(null, newUser);
        }
      }
      cb(null, currentUser);
    }
  )
);
