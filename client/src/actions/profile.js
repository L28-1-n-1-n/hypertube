import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ADD_MATCH_PREFERENCES,
  DISCONNECT,
} from './types';

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    // make request to backend api/profile/me
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

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

// Get profile by ID
export const getProfileByUsername = (username) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.token,
    },
  };
  try {
    // make request to backend api/profile/user/${username}

    const res = await axios.get(`/api/profile/user/${username}`, config);
    console.log(res)
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or update profile
export const editPreferences = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(
      '/api/profile/matchpreferences',
      formData,
      config
    );

    dispatch({
      type: ADD_MATCH_PREFERENCES,
      payload: res.data,
    });

    dispatch(setAlert('Match Preferences Updated', 'success'));
    history.push('/filters');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Disconnect with users
export const disconnect = (id) => async (dispatch) => {
  if (window.confirm('Are you sure? This CANNOT be undone!')) {
    try {
      await axios.post(`/api/profile/disconnect/${id}`);

      dispatch({ type: DISCONNECT });

      dispatch(setAlert('You have disconnected with this user.', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};