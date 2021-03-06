import {
  GET_MOVIES,
  GET_ONE_MOVIE,
  GET_COMMENTS,
  NEW_COMMENT,
  DOWNLOADED_MOVIE,
  DOWNLOAD_NEW_MOVIE,
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
        movies: state.movies.concat(payload),
        loading: false,
      };
    case GET_ONE_MOVIE:
      return {
        ...state,
        oneMovie: Object.assign(state.oneMovie, payload),
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
    case DOWNLOADED_MOVIE:
    case DOWNLOAD_NEW_MOVIE:
      return {
        ...state,
        oneMovie: Object.assign(state.oneMovie, payload),
        loading: false,
      };
    default:
      return state;
  }
}
