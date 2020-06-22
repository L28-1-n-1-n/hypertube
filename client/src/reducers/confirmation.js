import {
  EMAIL_VERIFIED,
  VERIFICATION_ERROR,
  RECUPERATE_ACCOUNT,
  RECUPERATION_ERROR,
  RESET_PW,
  RESET_PW_ERROR,
} from '../actions/types';

const initialState = {
  user: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_PW:
    case EMAIL_VERIFIED:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case RESET_PW_ERROR:
    case VERIFICATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case RECUPERATE_ACCOUNT:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case RECUPERATION_ERROR:
      // localStorage.removeItem('token'); // Remove token completely from local storage
      sessionStorage.removeItem('token'); // Remove token completely from local storage

      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false, // even though authentication failed, it is still done loading
      };
    default:
      return state;
  }
}
