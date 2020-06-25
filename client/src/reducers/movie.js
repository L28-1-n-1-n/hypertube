import { GET_MOVIES, GET_ONE_MOVIE } from '../actions/types';

const initialState = {
  movies: [],
  oneMovie: [],
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
    case GET_ONE_MOVIE:
      return {
        ...state,
        oneMovie: payload,
        loading: false,
      };

    default:
      return state;
  }
}
