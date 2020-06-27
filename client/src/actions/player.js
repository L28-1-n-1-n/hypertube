import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_ONE_MOVIE,
  MOVIE_DETAILS,
  COMMENT_ERROR,
  NEW_COMMENT,
  GET_COMMENTS,
  COMMENTSLIST_ERROR
} from './types';

// Get movie by ID
export const getMovieById = (movieId) => async (dispatch) => {
  try {
    // make request to YTS

    const res = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
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

    dispatch({
      type: NEW_COMMENT,
      payload: res,
    });

    dispatch(setAlert('Comment added', 'success'));
  } catch (err) {
    console.log(err);
  }
};


// Get profile by ID
export const getMovieComments = (movieId) => async (dispatch) => {
  try {
    // make request to backend api/profile/user/${movieId}

    const res = await axios.get(`/api/comments/${movieId}`);
    console.log("res getMovieComments below")
    console.log(res)
    dispatch({
      type: GET_COMMENTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
