const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { validationResult } = require('express-validator');
const Downloaded = require('../../models/Downloadedmovies');

// @route   POST api/player/download
// @desc    Download new movie
// @access  Private
router.post('/download', auth, async (req, res) => {
  try {
    const imdbId = req.body;
    movieDownloaded = new Downloaded({
      movieId: req.body.movieId,
      moviePath: '/uploads/video.mp4',
    });
    await movieDownloaded.save();

    return res.json(movieDownloaded);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/downloaded/:imdbId', async (req, res) => {
  try {
    const down = await Downloaded.findOne({
      movieId: req.params.imdbId,
    });

    if (!down) {
      console.log('NOTHING DOWNLOADED');
      return res.send({
        retStatus: 'Empty',
      });
    }
    console.log('Movie is downloaded already');
    res.json(down);
  } catch (err) {
    console.error(err.message);
    console.error('Non ca fonctionne pas du tout la');
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' }); // display message for non-valid userid
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
