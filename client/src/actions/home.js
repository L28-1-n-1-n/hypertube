import axios from 'axios';
import { setAlert } from './alert';

import { GET_MOVIES, PROFILE_ERROR, CLEAR_PROFILE } from './types';

// Get current users profile
export const fetchYTS = () => async (dispatch) => {
  try {
    // make request to backend api/profile/me
    const res = await axios.get(
      'https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50'
    );
    console.log(res.data.data.movies);
    dispatch({
      type: GET_MOVIES,
      payload: res.data.data.movies,
    });
  } catch (err) {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
