import { GET_MOVIES } from '../actions/types';

const initialState = {
  movies: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MOVIES:
      return {
        ...state,
        movies: payload,
        loading: false,
      };

    default:
      return state;
  }
}
