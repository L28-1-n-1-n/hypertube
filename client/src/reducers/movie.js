import { GET_MOVIES, GET_ONE_MOVIE, GET_COMMENTS } from '../actions/types';

const initialState = {
  movies: [],
  oneMovie: [],
  movieComments: [],
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
    case GET_COMMENTS:
      return {
        ...state,
        movieComments: payload,
        loading: false,
      };

    default:
      return state;
  }
}
