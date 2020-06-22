const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
  isProfilePic: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
  },
  firstname: {
    type: String,
  },
  likes: [
    // liked by which users
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  fileName: {
    type: String,
  },
  filePath: {
    type: String,
  },
  data: {
    type: Buffer,
  },
});

module.exports = Photo = mongoose.model('photo', PhotoSchema);
