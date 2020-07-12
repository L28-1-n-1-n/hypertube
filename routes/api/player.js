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
      lastWatched: Date.now(),
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
    await down.updateOne({ lastWatched: Date.now() });
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
  const writeFilePath = async (fPath, magnet) => {
    const streamingMovie = await Downloaded.findOne({
      movieMagnet: magnet,
    });
    await streamingMovie.updateOne({ filePath: fPath });
    console.log(streamingMovie);
  };
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
        writeFilePath(file.path, req.params.magnet);
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

router.get('/checkexpiration', async (req, res) => {
  console.log('back reached');
  let currentTime = new Date();
  let year = currentTime.getFullYear();
  let month = currentTime.getMonth(); // month starts with 0, ends with 11
  let date = currentTime.getDate(); // but date starts with 1 LOL
  console.log(typeof month);
  console.log(year, month, date);
  // const deleteExpiredMovies = async (filePath) => {
  //   await fs.unlink(`./torrents/${filePath}`);
  // };
  try {
    const toBeRemoved = await Downloaded.find({
      lastWatched: { $lt: new Date(year, month - 1, date) },
    });
    console.log(toBeRemoved);
    if (toBeRemoved.length > 0) {
      toBeRemoved.forEach((item) => {
        item.filePath = item.filePath.replace(/\s\[\]\(\)/g, '_');
        console.log(item.filePath);
        // deleteExpiredMovies(item.filePath);
        fs.unlink(`./torrents/${item.filePath}`, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        // console.log(item.filePath.replace(/\s/g, '_'));
      });
    }
    // await fs.unlink(`./torrents/${file.path}`))
    // if (!down) {
    //   console.log('NOTHING DOWNLOADED');
    //   return res.send({
    //     retStatus: 'Empty',
    //   });
    // }
    // console.log('Movie is downloaded already');
    // await down.updateOne({ lastWatched: Date.now() });
    // console.log(down);
    res.json(toBeRemoved);
  } catch (err) {
    console.error(err.message);
    console.error('Non ca fonctionne pas du tout la');
    //   if (err.kind == 'ObjectId') {
    //     return res.status(400).json({ msg: 'Profile not found' }); // display message for non-valid userid
    //   }
    //   res.status(500).send('Server Error');
  }
});

module.exports = router;
