const mongoose = require('mongoose');

const DownloadedSchema = new mongoose.Schema({
  movieId: {
    type: String, //movie imdbid
  },
  movieMagnet: {
    type: String,
  },
  movieTorrent: {
    type: String,
  },
  lastWatched: {
    type: Date,
  },
});

module.exports = Downloaded = mongoose.model('downloaded', DownloadedSchema);
