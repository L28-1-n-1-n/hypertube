import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_ONE_MOVIE,
  NEW_COMMENT,
  GET_COMMENTS,
  DOWNLOAD_MOVIE,
  DOWNLOADED_MOVIE,
  DOWNLOAD_NEW_MOVIE,
} from './types';

// Get movie by ID
export const getMovieById = (imdbId) => async (dispatch) => {
  try {
    // make request to YTS

    const resId = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`
    );
    console.log(resId);
    const res = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/movie_details.json?movie_id=` +
        resId.data.data.movies[0].id +
        `&with_cast=true`
    );

    console.log('res below from player.js');
    console.log(res.data.data.movie);

    dispatch({
      type: GET_ONE_MOVIE,
      payload: res.data.data.movie,
    });
  } catch (err) {
    console.log(err);
  }
};

// Add comment
export const addComment = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/comments/addcomment`, formData, config);
    if (res.data.retStatus === 'Error') {
      if (res.data.authorized === false && res.data.msg) {
        dispatch(setAlert(res.data.msg, 'danger'));
      }
    } else {
      dispatch({
        type: NEW_COMMENT,
        payload: res.data.comments[0], // add latest comment, which is the first element of the array comments reversed in the backend within the object newListOfComments
      });

      dispatch(setAlert('Comment added', 'success'));
    }
  } catch (err) {
    console.log(err);
  }
};

// Get profile by ID
export const getMovieComments = (imdbId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.token,
    },
  };
  try {
    // make request to backend api/profile/user/${imdbId}

    const res = await axios.get(`/api/comments/${imdbId}`, config);
    console.log('res getMovieComments below');
    console.log(res.data.comments);
    if (res.data.retStatus && res.data.retStatus === 'Empty') {
      dispatch({
        type: GET_COMMENTS,
        payload: [],
      });
    } else {
      dispatch({
        type: GET_COMMENTS,
        payload: res.data.comments,
      });
    }
  } catch (err) {
    // console.log(err);
  }
};

// Download movie
export const downloadMovie = (imdbId, magnet) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/player/download`, {
      movieId: imdbId,
      movieMagnet: magnet,
    });
    if (res.data.retStatus === 'Error') {
      if (res.data.authorized === false && res.data.msg) {
        dispatch(setAlert(res.data.msg, 'danger'));
      }
    } else if (res.data.retStatus && res.data.retStatus === 'Empty') {
      dispatch({
        type: DOWNLOAD_NEW_MOVIE,
        payload: {
          downloadedId: 'Empty',
        },
      });
    } else {
      dispatch({
        type: DOWNLOAD_NEW_MOVIE,
        payload: {
          downloadedId: res.data.movieId,
          movieMagnet: res.data.movieMagnet,
        },
      });
      dispatch(setAlert('Movie downloaded', 'success'));
    }
  } catch (err) {
    console.log(err);
  }
};

// Download movie
export const getDownloadedMovie = (imdbId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/player/downloaded/${imdbId}`, imdbId);
    if (res.data.retStatus === 'Error') {
      if (res.data.authorized === false && res.data.msg) {
        dispatch(setAlert(res.data.msg, 'danger'));
      }
    } else {
      dispatch({
        type: DOWNLOADED_MOVIE,
        payload: {
          downloadedId: res.data.movieId,
          movieMagnet: res.data.movieMagnet,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};
