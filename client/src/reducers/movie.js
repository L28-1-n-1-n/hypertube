import {
  GET_MOVIES,
  GET_ONE_MOVIE,
  GET_COMMENTS,
  NEW_COMMENT,
} from '../actions/types';

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
        // movies: payload,
        // movies: [...state.movies, payload],
        movies: state.movies.concat(payload),
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
    case NEW_COMMENT:
      return {
        ...state,
        // copy existing movieComments array, add new comment to the top of the array
        movieComments: [payload, ...state.movieComments],
        loading: false,
      };
    default:
      return state;
  }
}
