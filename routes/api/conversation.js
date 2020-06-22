const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Conversation = require('../../models/Conversation');

var UserList = require('../../config/userlist');
var userlist = UserList.userlist;

// @route   POST api/conversation
// @desc    Find relevant conversation
// @access  Private
router.post('/:targetUserID', auth, async (req, res) => {
  var notify_user = '';

  if (userlist.findIndex((x) => x.user === req.params.targetUserID) == -1) {
    const target_user = await User.findById(req.params.targetUserID);
    const sender = await User.findById(req.user.id);

    if (!target_user || !sender) {
      return res.status(400).json({ msg: 'User account not found' });
    }

    notify_user = await target_user.updateOne({
      $push: {
        notifications: {
          msg: `${sender.firstname} sent you a message.`,
          user: req.user.id,
        },
      },
    });
  }

  try {
    var converse = await Conversation.findOne({
      user1: req.user.id.toString(),
      user2: req.params.targetUserID.toString(),
    });
    if (!converse) {
      converse = await Conversation.findOne({
        user1: req.params.targetUserID.toString(),
        user2: req.user.id.toString(),
      });
    }
    if (!converse) {
      const newConversation = new Conversation({
        user1: req.user.id,
        user2: req.params.targetUserID,
        messages: [],
      });
      const newMessage = {
        name: req.body.name,
        time: req.body.time,
        chatMsg: req.body.chatMsg,
      };
      newConversation.messages.push(newMessage);
      await newConversation.save();
      if (notify_user) {
        return res.json({ newConversation, notify_user });
      } else {
        return res.json(newConversation);
      }
    }

    const push_new_message = await converse.updateOne({
      $push: {
        messages: {
          name: req.body.name,
          time: req.body.time,
          chatMsg: req.body.chatMsg,
        },
      },
    });

    if (notify_user) {
      return res.json({ push_new_message, notify_user });
    } else {
      return res.json(push_new_message);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/conversation/history/${userID}
// @desc Get message history between 2 users
// @access Private
router.get('/history/:userID', auth, async (req, res) => {
  try {
    var m_history = await Conversation.findOne({
      user1: req.user.id.toString(),
      user2: req.params.userID.toString(),
    });
    if (!m_history) {
      m_history = await Conversation.findOne({
        user1: req.params.userID.toString(),
        user2: req.user.id.toString(),
      });
    }
    if (!m_history) {
      return;
    }
    return res.json(m_history);
  } catch (err) {
    // console.error(err.message);
    console.log(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Conversation not found' });
    }
    res.status(500).send('Server Error');
  }
});
module.exports = router;
