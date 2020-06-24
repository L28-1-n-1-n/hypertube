import axios from 'axios';
import { setAlert } from './alert';

import { GET_MOVIES } from './types';

// Get filtered movies from api
export const fetchYTS = (inputs) => async (dispatch) => {
  const filteredResults = (searchYTS) => {
    // console.log(searchYTS.length);
    const dateinterval = inputs.year.split('_');
    const filtered = searchYTS.data.data.movies;
    const tmp = [];

    if (dateinterval[0] && dateinterval[1]) {
      for (var i = 0, j = 0; i < filtered.length; i++) {
        if (
          filtered[i].year >= dateinterval[0] &&
          filtered[i].year <= dateinterval[1]
        ) {
          tmp.push(filtered[i]);
        }
      }

      result = tmp.map(function (el) {
        var o = Object.assign({}, el);
        o.sitesrc = 'yts';
        return o;
      });

      return result;
    }
    result = filtered.map(function (el) {
      var o = Object.assign({}, el);
      o.sitesrc = 'yts';
      return o;
    });
    return result;
  };

  try {
    var inputsLength = Object.keys(inputs).length;
    var result;

    if (inputs && inputsLength == 5) {
      const dateinterval = inputs.year.split('_');

      if (inputs.search != '') {
        var searchYTS = await axios.get(
          'https://yts.mx/api/v2/list_movies.json?query_term=' +
            inputs.search +
            '&genre=' +
            inputs.genre +
            '&minimum_rating=' +
            inputs.rating +
            '&sort_by=title' +
            '&order_by=' +
            inputs.order +
            '&limit=500'
        );
      } else if (inputs.search == '') {
        var searchYTS = await axios.get(
          'https://yts.mx/api/v2/list_movies.json?genre=' +
            inputs.genre +
            '&minimum_rating=' +
            inputs.rating +
            '&sort_by=rating' +
            '&order_by=' +
            inputs.order +
            '&limit=500'
        );
      }
      if (
        searchYTS.data &&
        searchYTS.data.status === 'ok' &&
        searchYTS.data.data.movie_count >= 1
      ) {
        result = filteredResults(searchYTS);
      }
      // console.log(result);
    } else {
      var one = await axios.get(
        'https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50'
      );
      var two = await axios.get(
        'https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=2'
      );
      var three = await axios.get(
        'https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=3'
      );
      var fetchYTS_Results = one.data.data.movies.concat(
        two.data.data.movies,
        three.data.data.movies
      );

      // console.log(fetchYTS_Results.length);

      if (fetchYTS_Results.length >= 1) {
        result = fetchYTS_Results.map(function (el) {
          var o = Object.assign({}, el);
          o.sitesrc = 'yts';
          return o;
        });
      }
    }

    // console.log(result);
    if (result && result.length >= 1) {
      dispatch({
        type: GET_MOVIES,
        payload: result,
      });
    } else {
      dispatch(setAlert('No Results Found', 'danger'));
    }
  } catch (err) {
    console.log(err);
  }
};
