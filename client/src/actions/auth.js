import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  UPDATE_USER,
  PROFILE_ERROR,
  NOTIFICATION_REMOVAL_ERROR,
  DELETE_NOTIFICATIONS,
  UPDATE_PWD,
  PWD_ERROR,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  // if (localStorage.token) {
  //   setAuthToken(localStorage.token);
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data, // data of the user loaded
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Remove Notifications
export const removeNotifications = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/users/notifications/${id}`);

    dispatch({
      type: DELETE_NOTIFICATIONS,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_REMOVAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Register User
export const register = ({
  firstname,
  lastname,
  username,
  email,
  password,
}) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    firstname,
    lastname,
    username,
    email,
    password,
  });

  try {
    const res = await axios.post('/api/users', body, config);

    if (res.data.retStatus === 'Error') {
      if (res.data.authorized === false && res.data.msg) {
        dispatch(setAlert(res.data.msg, 'danger'));
      }
    } else {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(
        setAlert(
          'Successfully registered.',
          'success'
        )
      );
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (username, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post('/api/auth', body, config); // make POST request to /api/auth, sending body and config

    if (res.data.retStatus === 'Error') {
      if (res.data.authorized === false && res.data.msg) {
        dispatch(setAlert(res.data.msg, 'danger'));
      }
    } else {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = (userID) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Update user
export const updateUser = (formData, history, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/users/${id}`, formData, config);

    if (res.data.retStatus === 'Error') {
      if (res.data.authorized === false && res.data.msg) {
        dispatch(setAlert(res.data.msg, 'danger'));
      }
    } else {
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });

      dispatch(setAlert('User Details Updated', 'success'));
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

// Update users's password
export const updatePwd = (formDataTwo, history, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(
      `/api/users/resetPWD/${id}`,
      formDataTwo,
      config
    );

    if (res.data.retStatus === 'Error') {
      if (res.data.authorized === false && res.data.msg) {
        dispatch(setAlert(res.data.msg, 'danger'));
      }
    } else {
      dispatch({
        type: UPDATE_PWD,
        payload: res.data,
      });

      dispatch(setAlert('Password updated', 'success'));
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PWD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Login Redirect by OAuth
export const loginByAccessToken = (accessToken) => async (dispatch) => {
  try {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: accessToken },
    });
    // if (sessionStorage.token) {
    //   setAuthToken(sessionStorage.token);
    // }
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
