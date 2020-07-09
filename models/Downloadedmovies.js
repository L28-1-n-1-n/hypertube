const mongoose = require('mongoose');

const DownloadedSchema = new mongoose.Schema({
  movieId: {
    type: String, //movie imdbid
  },
  moviePath: {
    type: String, //path to the movie
  },
});

module.exports = Downloaded = mongoose.model('downloaded', DownloadedSchema);
