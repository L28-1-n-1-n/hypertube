const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { validationResult } = require('express-validator');
const Downloaded = require('../../models/Downloadedmovies');

// @route   POST api/player/download
// @desc    Download new movie
// @access  Private
router.post(
  '/download', auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      retStatus = 'Error';
      return res.send({
        retStatus: retStatus,
        authorized: false,
        msg: 'Comment cannot be empty.',
      })
    }

    try {
      const imdbId = req.body;
        movieDownloaded = new Downloaded({
            movieId: imdbId,
            moviePath: "/public/upload/video.mp4",
        });
        await movieDownloaded.save();

      return res.json(movieDownloaded);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
