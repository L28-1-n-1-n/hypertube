const express = require('express');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('config');
const db = config.get('mongoURI');

const PORT = process.env.PORT || 5000;
const router = express.Router();

const cors = require('cors');
const passport = require('passport');
// const FortyTwoStrategy = require('passport-42');
// const GitHubStrategy = require('passport-github2');
// const cookieSession = require('cookie-session');
// const cookieParser = require('cookie-parser'); // parse cookie header
const keys = require('./config/keys');
const passportStrategy = require('./config/passport-setup');
const chalk = require('chalk');
const User = require('./models/User');
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
connectDB();

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//   cb(null, user);
// });

// For Socket.io
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit('FromAPI', response);
};
// Run when client connects

var UserList = require('./config/userlist');
const { allowedNodeEnvironmentFlags } = require('process');
userlist = UserList.userlist;
io.on('connection', (socket) => {
  console.log('New WS Connection ...');

  socket.emit('logchannel', socket.id);
  // Broadcast to all clients except the current one
  // Broadcast when a user connects
  // io.emit(); will emit to ALL clients
  console.log('Initial userlist ', userlist);
  socket.on('conn_transfer', (m) => {
    let tmp = userlist.findIndex((x) => x.user === m.user);

    if (tmp !== -1) {
      userlist[tmp].sid = m.sid;
      console.log(userlist);
    } else if (m.user && m.sid) {
      userlist.push(m);
    }
    io.emit('listupdate', userlist);
  });
  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log('disconnected user is', socket.id);
    let tmp = userlist.findIndex((x) => x.sid === socket.id);
    if (tmp !== -1) {
      userlist.splice(tmp, 1);
      console.log(userlist);
    }
  });
  socket.on('logout_disconnect', (m) => {
    let tmp = userlist.findIndex((x) => x.user === m);
    if (tmp !== -1) {
      userlist.splice(tmp, 1);
      console.log(userlist);
    }
  });
  // Listen for newChatMessage
  socket.on('newChatMessage', (msg) => {
    io.emit('message', msg);
  });
  socket.on('initiateRefresh', (target_ID) => {
    io.emit('refreshTarget', target_ID);
  });
  socket.on('initialList', () => {
    io.emit('listupdate', userlist);
    console.log('userlist passed on', userlist);
  });
});

module.exports = {
  io: io,
};

// app.use(cors());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
// Init Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
// app.use(methodOverride());

// var allowCrossDomain = function (req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   // res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//   // intercept OPTIONS method
//   if ('OPTIONS' == req.method) {
//     res.send(200);
//   } else {
//     next();
//   }
// };
// app.use(allowCrossDomain);

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
//   );
//   if ('OPTIONS' == req.method) {
//     res.send(200);
//   } else {
//     next();
//   }
// });
// app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   next();
// });
// app.options('/auth/auth/github', function (req, res) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   res.end();
// });
// app.use(
//   cookieSession({
//     name: 'session',
//     keys: [keys.COOKIE_KEY],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );
// // parse cookies
// app.use(cookieParser());

app.use(
  session({
    secret: 'BigFatCats',
    // store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());

app.use(passport.session());
// GitHub
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: keys.githubClientID,
//       clientSecret: keys.githubClientSecret,
//       callbackUrl: 'http://localhost:5000/auth/github/callback',
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       console.log(chalk.yellow(profile));
//       let newUser = {
//         username: profile.username,
//         lastname: profile.displayName,
//         firstname: profile.displayName,
//         emailAddress: profile.emails[0].value,
//         avatar: profile.photos[0].value,
//         password: 'salut',
//       };
//       console.log(User);
//       User.findOne({ username: newUser.username }),
//         function (err, user) {
//           if (err) throw err;
//           console.log(chalk.blue(err));
//         };
//     }
//   )
// );

app.use(fileUpload());
app.use(express.static(path.join(__dirname, '/client/public')));

// app.get('/auth/github', (req, res, next) => {
//   passport.authenticate('github')(req, res, next);
// });

// app.get('/auth/github/callback', (req, res, next) => {
//   passport.authenticate('github', (err, user) => {
//     res.redirect('http://localhost:3000/homepage');
//   })(req, res, next);
// });

app.get('/', (req, res) => {
  res.send('API Running');
});
// app.get('/api/custom/auth/github', (req, res, next) => {
//   console.log('called');
//   // console.log(req, res, next);
//   passport.authenticate('github')(req, res, next);
//   // res.redirect(
//   //   'https://github.com/login/oauth/authorize?response_type=code&client_id=9c4ca4e91c36b7692f63'
//   // );
//   console.log(res);
//   // console.log(req, res, next);
// });

// app.get('/api/custom/auth/github', passport.authenticate('github'));
// app.get('/')
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/photos', require('./routes/api/photos'));
app.use('/api/confirmation', require('./routes/api/confirmation'));
app.use('/api/recuperation', require('./routes/api/recuperation'));
app.use('/api/reset', require('./routes/api/reset'));
app.use('/api/conversation', require('./routes/api/conversation'));

// var cors_proxy = require('cors-anywhere');
// // Listen on a specific host via the HOST environment variable
// var host = process.env.HOST || '127.0.0.1';
// // Listen on a specific port via the PORT environment variable
// var port = process.env.PORT || 3000;
// cors_proxy
//   .createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2'],
//   })
//   .listen(port, host, function () {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
//   });
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
