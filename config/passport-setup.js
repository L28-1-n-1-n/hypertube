const passport = require('passport'),
  GitHubStrategy = require('passport-github2').Strategy;
const FortyTwoStrategy = require('passport-42');
const crypto = require('crypto');
const chalk = require('chalk');
const keys = require('./keys');
const User = require('../models/User');
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
      clientID: keys.githubClientID,
      clientSecret: keys.githubClientSecret,
      callbackURL: 'http://localhost:5000/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      // console.log(chalk.yellow(JSON.stringify(profile)));

      var options = {
        host: 'api.github.com',
        path: '/users/' + profile.username + '/events/public',
        method: 'GET',
        headers: { 'user-agent': 'node.js' },
      };

      var req = https.request(options, function (res) {
        var body = '';
        res.on('data', function (chunk) {
          body += chunk.toString('utf8');
        });

        res.on('end', function () {
          var i = 0;
          var result = JSON.parse(body);
          while (
            !(
              result[i] &&
              result[i].payload &&
              result[i].payload.commits[0] &&
              result[i].payload.commits[0].author &&
              result[i].payload.commits[0].author.email
            ) &&
            i < result.length
          ) {
            i++;
          }
          const result_email = JSON.parse(body)[0].payload.commits[i].author
            .email;
          if (typeof result_email === 'undefined') {
            result_email = 'placeholder@email_unknown.com';
          }
          const register = async () => {
            const currentUser = await User.findOne({
              githubId: profile._json.id.toString(),
            });

            if (!currentUser) {
              const newUser = await new User({
                username: profile._json.login,
                firstname: profile._json.login,
                lastname: profile._json.login,
                email: result_email,
                password: crypto.randomBytes(8).toString('hex'),
                githubId: profile._json.id.toString(),
                imageUrl: profile.avatar_url,
              });
              newUser.save();
              if (newUser) {
                cb(null, newUser);
              }
            } else {
              cb(null, currentUser);
            }
          };
          register();
        });
      });

      req.end();
    }
  )
);

passport.use(
  'fortyTwo',
  new FortyTwoStrategy(
    {
      clientID: keys.fortyTwoClientID,
      clientSecret: keys.fortyTwoClientSecret,
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
          imageUrl: profile.photos[0].value,
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
