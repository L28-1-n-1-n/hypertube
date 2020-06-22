import {
  POST_CONVERSATION,
  RETRIVAL_ERROR,
  GET_MESSAGE_HISTORY,
} from '../actions/types';

const initialState = {
  conversations: [],
  conversation: null,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MESSAGE_HISTORY:
      return {
        ...state,
        conversations: payload,
      };
    case POST_CONVERSATION:
      return {
        ...state,
        conversations: [payload, ...state.conversations],
      };

    case RETRIVAL_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
}
