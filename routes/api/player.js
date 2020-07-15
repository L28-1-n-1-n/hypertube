const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const torrentStream = require('torrent-stream');
const auth = require('../../middleware/auth');
const { validationResult } = require('express-validator');
const Downloaded = require('../../models/Downloadedmovies');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const OpenSubtitles = require('opensubtitles-api');
const OS = new OpenSubtitles({
  useragent: 'TemporaryUserAgent',
  username: process.env.openSubtitlesUsername,
  password: process.env.openSubtitlesPassword,
  ssl: false,
});

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
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      await user.updateOne({
        $push: {
          movies: { movieId: req.body.movieId },
        },
      });
    }
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
      return res.send({
        retStatus: 'Empty',
      });
    }
    await down.updateOne({ lastWatched: Date.now() });
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

router.get('/stream/:movieId/:magnet', (req, res) => {
  const engine = torrentStream(req.params.magnet, {
    path: `./torrents/${req.params.movieId}`,
  });
  engine.on('ready', () => {
    engine.files.forEach((file) => {
      if (
        path.extname(file.name) === '.mp4' ||
        path.extname(file.name) === '.mkv' ||
        path.extname(file.name) === '.avi'
      ) {
        if (fs.existsSync(`./torrents/${req.params.movieId}/${file.path}`)) {
          fs.stat(`./torrents/${req.params.movieId}/${file.path}`, function (
            err,
            stats
          ) {
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
              .createReadStream(
                `./torrents/${req.params.movieId}/${file.path}`,
                {
                  start,
                  end,
                }
              )
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

OS.login()
  .then((res) => {
    console.log('\u001b[34;1m', '-> Successfully connected to OpenSubtitles');
  })
  .catch((error) => {
    console.log('\u001b[35;1m', '-> OpenSubtitles connection failed');
  });

router.get('/checkexpiration', async (req, res) => {
  let currentTime = new Date();
  let year = currentTime.getFullYear();
  let month = currentTime.getMonth(); // month starts with 0, ends with 11
  // but on MongoDB, the correct month is stored @.@
  // Therefore using month directly below already implies 1 month before
  let date = currentTime.getDate(); // but date starts with 1 LOL

  const deleteExpiredMovies = async (id) => {
    await Downloaded.findOneAndDelete({ movieId: id });
  };

  try {
    const toBeRemoved = await Downloaded.find({
      lastWatched: { $lt: new Date(year, month, date) },
    });
    if (toBeRemoved.length > 0) {
      toBeRemoved.forEach((item) => {
        fs.rmdirSync(`./torrents/${item.movieId}`, { recursive: true });
        deleteExpiredMovies(item.movieId);
      });
    }

    res.json(toBeRemoved);
  } catch (err) {
    console.error(err.message);
    console.error('Non ca fonctionne pas du tout la');

    //   res.status(500).send('Server Error');
  }
});

const getSubtitles = async (imdbid, langs) => {
  try {
    const response = await OS.search({
      imdbid,
      sublanguageid: langs.join(),
      limit: 'best',
    });
    return Promise.all(
      Object.entries(response).map(async (entry) => {
        const langCode = entry[0];

        return new Promise((resolve, reject) => {
          let req = http.get(entry[1].vtt);
          req.on('response', (res) => {
            const file = fs.createWriteStream(
              `./subtitles/${imdbid}_${langCode}`
            );
            const stream = res.pipe(file);
            stream.on('finish', () => {
              fs.readFile(
                `./subtitles/${imdbid}_${langCode}`,
                'utf8',
                (err, content) => {
                  if (!err) {
                    const buffer = Buffer.from(content);
                    resolve({
                      key: langCode,
                      value: buffer.toString('base64'),
                    });
                  }
                }
              );
            });
          });
          req.on('error', (error) => {
            reject(error);
          });
        });
      })
    );
  } catch (error) {
    //console.log(error)
  }
};

router.get('/subtitles/:imdbid', async (req, res) => {
  const { imdbid } = req.params;
  const langs = ['fre', 'eng', 'spn'];
  try {
    const response = await getSubtitles(imdbid, langs);
    let subtitles = {};

    if (response) {
      response.forEach((subtitle) => {
        subtitles = {
          ...subtitles,
          [subtitle.key]: subtitle.value,
        };
      });
    }

    res.json({ subtitles });
  } catch (error) {
    res.json({ error });
  }
});
module.exports = router;
