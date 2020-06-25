const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxLength: 120,
  },

  comment: {
    type: String,
    required: true,
    maxLength: 500,
  },

  movie: {
    type: Number,
    required: true,
  }
});

module.exports = Comments = mongoose.model('comments', CommentsSchema);
