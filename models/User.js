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
  fileName: {
    type: String,
    default: 'generic_avatar.jpg',
  },
  filePath: {
    type: String,
    default: '/uploads/generic_avatar.jpg',
  },
  data: {
    type: Buffer,
  },
  githubId: {
    type: String,
  },
  fortyTwoId: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  movies: [
    {
      movieId: {
        type: String,
      },
    },
  ],
});

module.exports = User = mongoose.model('user', UserSchema);
