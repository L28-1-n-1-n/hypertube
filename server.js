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
const passport = require('passport');
const passportStrategy = require('./config/passport-setup');
const keys = require('./config/keys');
const chalk = require('chalk');
const User = require('./models/User');

connectDB();

// For Socket.io
const http = require('http');
const server = http.createServer(app);
// Run when client connects

// Init Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
app.use(cors());
app.use(passport.initialize());

app.use(fileUpload());
app.use(express.static(path.join(__dirname, '/client/public')));

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
