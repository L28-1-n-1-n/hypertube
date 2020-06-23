import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  PROMPT_UPLOAD_PROFILE_PHOTO,
  ADD_MATCH_PREFERENCES,
  DISCONNECT,
  BLOCK_USER,
  REPORT_FAKE,
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
export const getProfileById = (userId) => async (dispatch) => {
  try {
    // make request to backend api/profile/user/${userId}

    const res = await axios.get(`/api/profile/user/${userId}`);

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
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if (!edit) {
      history.push('/dashboard');

      dispatch({
        type: PROMPT_UPLOAD_PROFILE_PHOTO,
      });
    }
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

// Delete account & profile
export const deleteAccount = (id) => async (dispatch) => {
  if (window.confirm('Are you sure? This CANNOT be undone!')) {
    try {
      await axios.delete(`/api/profile`);

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanently deleted', 'danger'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

// Example code for getting Client-side IP address, not used here to get physical location of user since client side ip is localhost
export const detailedGeo = () => async (dispatch) => {
  console.log('detailedGeo logged');
  try {
    axios.get('/api/profile/cip');
  } catch (err) {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', err.message);
    }
    console.log(err.config);
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

// Block user
export const block = (id) => async (dispatch) => {
  if (window.confirm('Are you sure? This CANNOT be undone!')) {
    try {
      await axios.post(`/api/profile/block/${id}`);

      dispatch({ type: BLOCK_USER });

      dispatch(setAlert('You have blocked this user.', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

// Report user as fake
export const reportFake = (id) => async (dispatch) => {
  if (window.confirm('Are you sure? This CANNOT be undone!')) {
    try {
      await axios.post(`/api/profile/reportfake/${id}`);

      dispatch({ type: REPORT_FAKE });

      dispatch(setAlert('You have reported this user as fake.', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
