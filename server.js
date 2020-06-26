const express = require('express');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');

const bodyParser = require('body-parser');
const path = require('path');

const config = require('config');
const db = config.get('mongoURI');
const app = express();
const PORT = process.env.PORT || 5000;
const router = express.Router();

const cors = require('cors');
const passport = require("passport");
const FortyTwoStrategy = require("passport-42");
const GitHubStrategy = require("passport-github2");
const keys = require("./config/keys");
const chalk = require("chalk");
const User = require('./models/User');

connectDB();

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});



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

// Init Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
app.use(cors());
app.use(passport.initialize())

// GitHub
passport.use(new GitHubStrategy({
  clientID: keys.GITHUB.clientID,
  clientSecret: keys.GITHUB.clientSecret,
  callbackUrl: "http://localhost:5000/auth/github/callback"
},
(accessToken, refreshToken, profile, cb) => {
  console.log(chalk.yellow(profile));
  let newUser = {
    'username': profile.username,
    'lastname': profile.displayName,
    'firstname': profile.displayName,
    'emailAddress': profile.emails[0].value,
    'avatar': profile.photos[0].value,
    'password': "salut"
};
console.log(User);
  User.findOne({username: newUser.username}), function (err, user){
    if(err) throw err;
    console.log(chalk.blue(err))
  };
}))



app.use(fileUpload());
app.use(express.static(path.join(__dirname, '/client/public')));


app.get("/auth/github", (req,res,next) => {
  passport.authenticate("github")(req,res,next);
})

app.get("/auth/github/callback", (req,res,next) => {
  passport.authenticate("github", (err, user) => {
    res.redirect("http://localhost:3000/homepage");
  })(req, res, next)
})

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/photos', require('./routes/api/photos'));
app.use('/api/confirmation', require('./routes/api/confirmation'));
app.use('/api/recuperation', require('./routes/api/recuperation'));
app.use('/api/reset', require('./routes/api/reset'));
app.use('/api/conversation', require('./routes/api/conversation'));

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
