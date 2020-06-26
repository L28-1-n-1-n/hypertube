const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  movieId: {
    type: Number, //movie id
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      username: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = Comment = mongoose.model('comment', CommentSchema);
