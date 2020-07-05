const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(
      __dirname,
      '..',
      '..',
      'client',
      'public',
      'uploads'
    );
    // fs.mkdirSync(uploadsDir)
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originlaname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1000 * 1000 }, //5MB per photo
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
});
// unfortunately this does not work
var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb('Invalid file type. Only JPEG, JPG and PNG file are allowed.');
  }
};


// const io = require('../../server').io;
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const file = req.files.file;

  const uploadsDir = path.join(
    __dirname,
    '..',
    '..',
    'client',
    'public',
    'uploads'
  );
  // console.log(path.resolve(uploadsDir, file.name));
  try {
    file.mv(path.resolve(uploadsDir, file.name), async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      } 
      const userFields = {
        _id: req.user.id,
        fileName: file.name,
        filePath: `/uploads/${file.name}`,
        data: fs.readFileSync(path.resolve(uploadsDir, file.name)),
      };
      let user = await User.findOne({ _id: req.user.id }).select(
        '-username -password'
      );
      console.log(user)
      if (user) {
        user = await User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: userFields },
          { new: true },
        );
      }
      return res.json(user);
    });
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
});

module.exports = router;
