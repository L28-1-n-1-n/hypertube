import axios from 'axios';

import {
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  POST_CONVERSATION,
  RETRIVAL_ERROR,
  GET_MESSAGE_HISTORY,
} from './types';

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  // prevent flashing the past user's profile by clearing the state
  dispatch({ type: CLEAR_PROFILE });

  try {
    // make request to backend api/profile
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get corresponding conversation
export const postConversation = (targetUserID, transMsg) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post(
      `/api/conversation/${targetUserID}`,
      transMsg,
      config
    );

    dispatch({
      type: POST_CONVERSATION,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RETRIVAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Message History
export const getMessageHistory = (userID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/conversation/history/${userID}`);

    dispatch({
      type: GET_MESSAGE_HISTORY,
      payload: res.data.messages,
    });
  } catch (err) {
    dispatch({
      type: RETRIVAL_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
