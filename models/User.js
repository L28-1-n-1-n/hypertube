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
  lang: {
    type: String,
    isIn: ['en', 'fr', 'es'],
    default: 'en',
    description: 'The language of the site.',
  },
  token: {
    type: String,
  },
  githubId: {
    type: String,
  },
  fortyTwoId: {
    type: String,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
