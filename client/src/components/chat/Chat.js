import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import moment from 'moment';
import { socket } from '../../actions/socClient';
import {
  postConversation,
  getMessageHistory,
} from '../../actions/conversation';

const Chat = ({
  getCurrentProfile,
  postConversation,
  getMessageHistory,
  profile: {
    profile: { user, correspondances },
  },
  conversation: { conversations },
}) => {
  const [inputMsg, setInputMsg] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [targetSoc, setTargetSoc] = useState({});
  const [userList, setUserList] = useState([]);
  const [targetUserID, setTargetUserID] = useState('');
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });
  };
  const MessageItem = ({ item }) => {
    return (
      <div className='message'>
        {item.name && item.chatMsg && (
          <Fragment>
            <p className='meta'>
              {item.name} <span>{item.time}</span>
            </p>
            <p className='text'>{item.chatMsg}</p>
          </Fragment>
        )}
      </div>
    );
  };

  const findTargetSoc = (userID) => {
    let tmp = userList.findIndex((x) => x.user === userID);
    // If user is online
    if (tmp !== -1) {
      setTargetSoc(userList[tmp]);
    }
    if (userID) {
      getMessageHistory(userID);
      setTargetUserID(userID);
    }
  };
  const isUserOnline = (userID) => {
    if (userList.findIndex((x) => x.user === userID) !== -1) {
      return 1;
    } else {
      return 0;
    }
  };
  const getInit = () => {
    socket.emit('initialList', userList);
    socket.on('listupdate', (list) => {
      setUserList(list);
    });
  };
  useEffect(() => {
    getInit();
    //Message from server
    socket.on('listupdate', (list) => {
      setUserList(list);
    });
    socket.on('message', (message) => {
      setMessageList((prevState) => [...prevState, message]);
      // Scroll down automatically as messages accumulate
      scrollToBottom();
    });
    getCurrentProfile();
    if (targetUserID) {
      getMessageHistory(targetUserID);
    }
  }, [getCurrentProfile, getMessageHistory]);
  const onSubmit = async (e) => {
    e.preventDefault();
    var now = new moment();
    var transMsg = {
      userid: user._id,
      name: user.firstname,
      timestamp: now.valueOf(),
      time: now.format('LLL'),
      chatMsg: inputMsg,
    };
    // Emit message to server
    if (targetSoc) {
      socket.emit('newChatMessage', transMsg, targetSoc.sid);
    }
    if (targetUserID) {
      postConversation(targetUserID, transMsg);
    }
    setInputMsg('');
  };

  return (
    <Fragment>
      <div className='chat-container'>
        <header className='chat-header'>
          <h1>
            <i className='far fa-comments'></i> Instant Chat
          </h1>
        </header>
        <main className='chat-main'>
          <div className='chat-sidebar'>
            <h3>
              Connected Users <i className='fas fa-user-friends'></i>
            </h3>
            <ul id='users'>
              {correspondances.length > 0 ? (
                correspondances.map((connection) => (
                  <li
                    onClick={() => findTargetSoc(connection.user)}
                    key={connection._id}
                  >
                    {' '}
                    {isUserOnline(connection.user) ? (
                      <i
                        className='fas fa-circle'
                        style={{ color: 'chartreuse' }}
                      ></i>
                    ) : (
                      <i className='fas fa-circle' style={{ color: 'red' }}></i>
                    )}{' '}
                    {connection.name.toString()}{' '}
                  </li>
                ))
              ) : (
                <h4> No profiles found...</h4>
              )}
            </ul>
          </div>
          <div className='chat-messages'>
            {targetUserID && conversations && (
              <div>
                {conversations &&
                  conversations.map((item) => (
                    <MessageItem key={item._id} item={item} />
                  ))}
                <div ref={messagesEndRef} />
              </div>
            )}
            {targetUserID ? (
              <div>
                {messageList &&
                  messageList.map((item) => (
                    <MessageItem key={item.timestamp} item={item} />
                  ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div>
                <h3>
                  <i className='far fa-hand-point-left' aria-hidden='true'></i>
                  &nbsp;Please pick a user
                </h3>
              </div>
            )}
          </div>
        </main>
        <div className='chat-form-container'>
          <form id='chat-form' onSubmit={(e) => onSubmit(e)}>
            <input
              id='message'
              name='message'
              type='text'
              placeholder='Enter Message'
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              required
              autoComplete='off'
            />
            <input type='submit' className='btn btn-primary' value='Send' />
          </form>
        </div>
      </div>
      {/* Custom shape divider at bottom of page */}
      <div class='custom-shape-divider-bottom-1592108734'>
        <svg
          data-name='Layer 1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
        >
          <path
            d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
            opacity='.25'
            class='shape-fill'
          ></path>
          <path
            d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z'
            opacity='.5'
            class='shape-fill'
          ></path>
          <path
            d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'
            class='shape-fill'
          ></path>
        </svg>
      </div>
    </Fragment>
  );
};

Chat.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  postConversation: PropTypes.func.isRequired,
  getMessageHistory: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  conversation: state.conversation,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  postConversation,
  getMessageHistory,
})(Chat);

// export default Chat;
