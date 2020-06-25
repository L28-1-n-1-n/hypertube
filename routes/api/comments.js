const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Comments = require('../../models/Comments');

// @route   POST api/comments
// @desc    Find relevant conversation
// @access  Private
router.post(
    '/addcomment',
    [
      auth,
      [
        check('comment', 'Comment cannot be empty').not().isEmpty(),
      ],
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { comment } = req.body;
      const userFields = {
        username: req.user.username,
        comment: comment,
        movie: 1086,
      };
  
      try {
        commentary = await Comments.create(
          { $set: userFields },
          { new: true }
        );
        return res.json(commentary);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );


module.exports = router;
