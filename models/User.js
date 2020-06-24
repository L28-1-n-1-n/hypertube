const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
    maxLength: 120,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 120,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    protect: true,
  },
  avatar: {
    type: 'string',
    required: true,
    description: 'User avatar.',
    maxLength: 10000000,
    example: 'file.png'
  },
  lang: {
    type: 'string',
    isIn: ['en', 'fr', 'es'],
    defaultsTo: 'en',
    description: 'The language of the site.',
  },
  token: {
    type: String,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
