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

connectDB();

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

app.use(fileUpload());
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/public')));
app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/photos', require('./routes/api/photos'));
app.use('/api/confirmation', require('./routes/api/confirmation'));
app.use('/api/recuperation', require('./routes/api/recuperation'));
app.use('/api/reset', require('./routes/api/reset'));
app.use('/api/conversation', require('./routes/api/conversation'));

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
