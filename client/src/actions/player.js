import axios from 'axios';

import { GET_ONE_MOVIE, MOVIE_DETAILS } from './types';

// Get movie by ID
export const getMovieById = (movieId) => async (dispatch) => {
  console.log('front reached');
  try {
    // make request to YTS

    const res = await axios.get(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
    );

    console.log('res below from player.js');
    console.log(res.data.data.movie);

    dispatch({
      type: GET_ONE_MOVIE,
      payload: res.data.data.movie,
    });
    console.log(res);
  } catch (err) {
    console.log(err);
    // dispatch({
    //   type: MOVIE_DETAILS,
    //   payload: { msg: err.response.statusText, status: err.response.status },
    // });
  }
};
