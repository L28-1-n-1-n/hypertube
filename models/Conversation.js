const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user1',
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user2',
  },
  messages: [
    {
      name: {
        type: String,
      },
      time: {
        type: Date,
      },
      chatMsg: {
        type: String,
      },
    },
  ],
});

module.exports = Conversation = mongoose.model(
  'conversation',
  ConversationSchema
);
