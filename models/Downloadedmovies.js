const mongoose = require('mongoose');

const DownloadedSchema = new mongoose.Schema({
  movieId: {
    type: String, //movie imdbid
  },
  moviePath: {
    type: String, //path to the movie
  },
  movieMagnet: {
    type: String,
  },
});

module.exports = Downloaded = mongoose.model('downloaded', DownloadedSchema);
