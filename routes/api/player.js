const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const torrentStream = require('torrent-stream');
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
      movieMagnet: req.body.movieMagnet,
    });
    await movieDownloaded.save();
    console.log('movieDownloaded: ', movieDownloaded);
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
    console.log(down);
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

router.get('/stream/:magnet', (req, res) => {
  console.log('originalUrl is', req.originalUrl);
  // console.log(req.params.magnet);
  const engine = torrentStream(req.params.magnet, { path: './torrents' });
  engine.on('ready', () => {
    engine.files.forEach((file) => {
      if (
        path.extname(file.name) === '.mp4' ||
        path.extname(file.name) === '.mkv' ||
        path.extname(file.name) === '.avi'
      ) {
        console.log(file.path);
        if (fs.existsSync(`./torrents/${file.path}`)) {
          fs.stat(`./torrents/${file.path}`, function (err, stats) {
            if (err) {
              if (err.code === 'ENOENT') {
                // 404 Error if file not found
                return res.sendStatus(404);
              }
              res.end(err);
            }
            var range = req.headers.range;
            if (!range) {
              // 416 Wrong range
              return res.sendStatus(416);
            }
            const positions = range.replace(/bytes=/, '').split('-');
            let start = parseInt(positions[0], 10);
            const total = stats.size;
            const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            if (start >= end) start = end;
            const chunksize = end - start + 1;
            res.writeHead(206, {
              'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'video/mp4',
            });
            var stream = fs
              .createReadStream(`./torrents/${file.path}`, { start, end })
              .on('open', function () {
                stream.pipe(res);
              })
              .on('error', function (err) {
                res.end(err);
              });
          });
        } else {
          const fileStream = file.createReadStream();
          fileStream.pipe(res);
        }
      }
    });
  });
});

module.exports = router;
