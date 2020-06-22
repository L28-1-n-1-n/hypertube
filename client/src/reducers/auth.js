import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  UPDATE_USER,
  PROMPT_UPLOAD_PROFILE_PHOTO,
  FIRST_PHOTO_UPLOADED,
  DELETE_NOTIFICATIONS,
} from '../actions/types';

const initialState = {
  // token: localStorage.getItem('token'),
  token: sessionStorage.getItem('token'),
  isAuthenticated: null,
  justRegistered: null,
  justCreatedProfile: false,
  loading: true, // default true, once loaded, loading is set to false
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action; // take out type and payload from action

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, // firstname, email ... everything but the password
        justCreatedProfile: false,
      };
    // case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // localStorage.setItem('token', payload.token); // set the token in local storage, payload is an object
      sessionStorage.setItem('token', payload.token); // set the token in local storage, payload is an object

      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false, // it's been loaded, so set to false
        justCreatedProfile: false,
      };
    case REGISTER_SUCCESS:
      // localStorage.removeItem('token'); // Remove token completely from local storage
      sessionStorage.removeItem('token'); // Remove token completely from local storage

      return {
        ...state,
        token: null,
        justRegistered: true,
        isAuthenticated: false,
        loading: false, // even though authentication failed, it is still done loading
      };
    case REGISTER_FAIL:
      // localStorage.removeItem('token'); // Remove token completely from local storage
      sessionStorage.removeItem('token'); // Remove token completely from local storage

      return {
        ...state,
        token: null,
        justRegistered: false,
        isAuthenticated: false,
        loading: false, // even though authentication failed, it is still done loading
        justCreatedProfile: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      // localStorage.removeItem('token'); // Remove token completely from local storage
      sessionStorage.removeItem('token'); // Remove token completely from local storage
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false, // even though authentication failed, it is still done loading
      };
    case DELETE_NOTIFICATIONS:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case PROMPT_UPLOAD_PROFILE_PHOTO:
      return {
        ...state,
        justCreatedProfile: true,
      };
    case FIRST_PHOTO_UPLOADED:
      return {
        ...state,
        justCreatedProfile: false,
      };
    default:
      return state;
  }
}
