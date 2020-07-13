const passport = require('passport'),
  GitHubStrategy = require('passport-github2').Strategy;
const FortyTwoStrategy = require('passport-42');
const crypto = require('crypto');
const chalk = require('chalk');
const User = require('../models/User');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const https = require('https');

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
      clientID: process.env.githubClientID,
      clientSecret: process.env.githubClientSecret,
      callbackURL: 'http://localhost:5000/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      const currentUser = await User.findOne({
        githubId: profile._json.id.toString(),
      });

      if (!currentUser) {
        const newUser = await new User({
          username: profile._json.login,
          firstname: profile._json.login,
          lastname: profile._json.login,
          email:
            crypto.randomBytes(8).toString('hex') +
            '@' +
            crypto.randomBytes(8).toString('hex') +
            '.com',
          password: crypto.randomBytes(8).toString('hex'),
          githubId: profile._json.id.toString(),
          filePath: profile._json.avatar_url,
        });
        newUser.save();
        if (newUser) {
          cb(null, newUser);
        }
      } else {
        cb(null, currentUser);
      }
    }
  )
);

passport.use(
  'fortyTwo',
  new FortyTwoStrategy(
    {
      clientID: process.env.fortyTwoClientID,
      clientSecret: process.env.fortyTwoClientSecret,
      callbackURL: `http://localhost:5000/api/auth/fortytwo/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const currentUser = await User.findOne({
        fortyTwoId: profile.id,
      });

      if (!currentUser) {
        const newUser = await new User({
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          username: profile.username + Math.floor(Math.random() * 100),
          email: profile.emails[0].value,
          password: crypto.randomBytes(8).toString('hex'),
          fortyTwoId: profile.id,
          filePath: profile.photos[0].value,
        });
        newUser.save();

        if (newUser) {
          cb(null, newUser);
        }
      } else {
        cb(null, currentUser);
      }
    }
  )
);
