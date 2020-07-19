import axios from 'axios';
import { setAlert } from './alert';

import { GET_MOVIES } from './types';

// Get filtered movies from api
export const fetchYTS = (inputs) => async (dispatch) => {
  function jsEscape(str) {
    return String(str).replace(/[^\w. ]/gi, function (c) {
      return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    });
  }
  inputs.search = jsEscape(inputs.search);
  if (
    inputs.search.toLowerCase().includes('script') ||
    inputs.search.toLowerCase().includes('onload')
  ) {
    inputs.search = '';
    window.location.replace('http://localhost:3000/homepage');
  }

  const filteredResults = (searchYTS) => {
    const dateinterval = inputs.year.split('_');
    const filtered = searchYTS.data.data.movies;
    const tmp = [];

    if (dateinterval[0] && dateinterval[1]) {
      for (var i = 0; i < filtered.length; i++) {
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

  const filteredPop = (searchPop, title, yearmin, yearmax, genre, rate) => {
    let results = searchPop.filter(
      (item) =>
        item.title === title &&
        item.year >= yearmin &&
        item.year <= yearmax &&
        item.genres.includes(genre) &&
        item.rating.percentage >= rate * 10
    );

    return results;
  };

  const filteredPopTitle = (searchPop, yearmin, yearmax, genre, rate) => {
    let results = searchPop.filter(
      (item) =>
        item.year >= yearmin &&
        item.year <= yearmax &&
        item.genres.includes(genre) &&
        item.rating.percentage >= rate * 10
    );

    return results;
  };

  try {
    var inputsLength = Object.keys(inputs).length;
    var result = [];
    var result2 = [];

    if (inputs && inputsLength === 6) {
      const dateinterval = inputs.year.split('_');
      if (inputs.search !== '') {
        var searchYTS = await axios.get(
          'https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?query_term=' +
            inputs.search +
            '&genre=' +
            inputs.genre +
            '&minimum_rating=' +
            inputs.rating +
            '&sort_by=title' +
            '&order_by=' +
            inputs.order +
            '&limit=50'
        );
        const searchPop = await axios.all([
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/1'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/2'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/3'
          ),
        ]);
        var fetchPOP_Results = searchPop[0].data.concat(
          searchPop[1].data,
          searchPop[2].data
        );
        if (dateinterval[0] && dateinterval[1]) {
          result2 = filteredPop(
            fetchPOP_Results,
            inputs.search,
            dateinterval[0],
            dateinterval[1],
            inputs.genre,
            inputs.rating
          );
        } else {
          result2 = filteredPop(
            fetchPOP_Results,
            inputs.search,
            1800,
            2020,
            inputs.genre,
            inputs.rating
          );
        }
      } else if (inputs.search === '') {
        const dateinterval = inputs.year.split('_');
        searchYTS = await axios.get(
          'https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?genre=' +
            inputs.genre +
            '&minimum_rating=' +
            inputs.rating +
            '&sort_by=rating' +
            '&order_by=' +
            inputs.order +
            '&limit=50'
        );
        const searchPop = await axios.all([
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/1'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/2'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/3'
          ),
        ]);
        fetchPOP_Results = searchPop[0].data.concat(
          searchPop[1].data,
          searchPop[2].data
        );
        if (dateinterval[0] && dateinterval[1]) {
          result2 = filteredPopTitle(
            fetchPOP_Results,
            dateinterval[0],
            dateinterval[1],
            inputs.genre,
            inputs.rating
          );
        } else {
          result2 = filteredPopTitle(
            fetchPOP_Results,
            1800,
            2020,
            inputs.genre,
            inputs.rating
          );
        }
      }
      if (
        searchYTS.data &&
        searchYTS.data.status === 'ok' &&
        searchYTS.data.data.movie_count >= 1
      ) {
        if (result2.length >= 1) {
          result2 = result2.map(function (el) {
            var p = Object.assign({}, el);
            p.rating = el.rating.percentage / 10;
            p.medium_cover_image = el.images.poster;
            p.imdb_code = el.imdb_id;
            return p;
          });
        }

        result = filteredResults(searchYTS).concat(result2);
      }
    } else {
      var multi = inputs.multiple;
      const yolo = await axios.all([
        await axios.get(
          `https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/${
            3 * multi - 2
          }`
        ),
        await axios.get(
          `https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/${
            3 * multi - 1
          }`
        ),
        await axios.get(
          `https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/${
            3 * multi
          }`
        ),
      ]);
      var one = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=${
          3 * multi - 2
        }`
      );
      var two = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=5&page=${
          3 * multi - 1
        }`
      );
      var three = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=5&page=${
          3 * multi
        }`
      );

      var fetchYTS_Results = one.data.data.movies.concat(
        two.data.data.movies,
        three.data.data.movies
      );

      fetchPOP_Results = yolo[0].data.concat(yolo[1].data, yolo[2].data);

      if (fetchPOP_Results.length >= 1) {
        result2 = fetchPOP_Results.map(function (el) {
          var p = Object.assign({}, el);
          p.rating = el.rating.percentage / 10;
          p.medium_cover_image = el.images.poster;
          p.imdb_code = el.imdb_id;
          return p;
        });
      }

      if (fetchYTS_Results.length >= 1) {
        result = fetchYTS_Results.map(function (el) {
          var o = Object.assign({}, el);
          o.sitesrc = 'yts';
          return o;
        });
      }
      result = result.concat(result2);
    }

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

// Get filtered movies from api
export const fetchInfiniteYTS = (inputs) => async (dispatch) => {
  const filteredResults = (searchYTS) => {
    const dateinterval = inputs.year.split('_');
    const filtered = searchYTS.data.data.movies;
    const tmp = [];

    if (dateinterval[0] && dateinterval[1]) {
      for (var i = 0; i < filtered.length; i++) {
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

  const filteredPop = (searchPop, title, yearmin, yearmax, genre, rate) => {
    let results = searchPop.filter(
      (item) =>
        item.title === title &&
        item.year >= yearmin &&
        item.year <= yearmax &&
        item.genres.includes(genre) &&
        item.rating.percentage >= rate * 10
    );
    return results;
  };

  const filteredPopTitle = (searchPop, yearmin, yearmax, genre, rate) => {
    let results = searchPop.filter(
      (item) =>
        item.year >= yearmin &&
        item.year <= yearmax &&
        item.genres.includes(genre) &&
        item.rating.percentage >= rate * 10
    );
    return results;
  };

  try {
    var inputsLength = Object.keys(inputs).length;
    var result = [];
    var result2 = [];

    if (inputs && inputsLength === 6) {
      const dateinterval = inputs.year.split('_');
      if (inputs.search !== '') {
        var searchYTS = await axios.get(
          'https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?query_term=' +
            inputs.search +
            '&genre=' +
            inputs.genre +
            '&minimum_rating=' +
            inputs.rating +
            '&sort_by=title' +
            '&order_by=' +
            inputs.order +
            '&limit=50'
        );
        const searchPop = await axios.all([
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/1'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/2'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/3'
          ),
        ]);
        var fetchPOP_Results = searchPop[0].data.concat(
          searchPop[1].data,
          searchPop[2].data
        );
        if (dateinterval[0] && dateinterval[1]) {
          result2 = filteredPop(
            fetchPOP_Results,
            inputs.search,
            dateinterval[0],
            dateinterval[1],
            inputs.genre,
            inputs.rating
          );
        } else {
          result2 = filteredPop(
            fetchPOP_Results,
            inputs.search,
            1800,
            2020,
            inputs.genre,
            inputs.rating
          );
        }
      } else if (inputs.search === '') {
        const dateinterval = inputs.year.split('_');
        searchYTS = await axios.get(
          'https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?genre=' +
            inputs.genre +
            '&minimum_rating=' +
            inputs.rating +
            '&sort_by=rating' +
            '&order_by=' +
            inputs.order +
            '&limit=50'
        );
        const searchPop = await axios.all([
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/1'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/2'
          ),
          await axios.get(
            'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/3'
          ),
        ]);
        fetchPOP_Results = searchPop[0].data.concat(
          searchPop[1].data,
          searchPop[2].data
        );
        if (dateinterval[0] && dateinterval[1]) {
          result2 = filteredPopTitle(
            fetchPOP_Results,
            dateinterval[0],
            dateinterval[1],
            inputs.genre,
            inputs.rating
          );
        } else {
          result2 = filteredPopTitle(
            fetchPOP_Results,
            1800,
            2020,
            inputs.genre,
            inputs.rating
          );
        }
      }
      if (
        searchYTS.data &&
        searchYTS.data.status === 'ok' &&
        searchYTS.data.data.movie_count >= 1
      ) {
        if (result2.length >= 1) {
          result2 = result2.map(function (el) {
            var p = Object.assign({}, el);
            p.rating = el.rating.percentage / 10;
            p.medium_cover_image = el.images.poster;
            p.imdb_code = el.imdb_id;
            return p;
          });
        }
        result = filteredResults(searchYTS).concat(result2);
      }
    } else {
      var multi = inputs.multiple;
      const yolo = await axios.all([
        await axios.get(
          `https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/${
            3 * multi - 2
          }`
        ),
        await axios.get(
          `https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/${
            3 * multi - 1
          }`
        ),
        await axios.get(
          `https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh/movies/${
            3 * multi
          }`
        ),
      ]);
      var one = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=${
          3 * multi - 2
        }`
      );
      var two = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=5&page=${
          3 * multi - 1
        }`
      );
      var three = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=5&page=${
          3 * multi
        }`
      );

      var fetchYTS_Results = one.data.data.movies.concat(
        two.data.data.movies,
        three.data.data.movies
      );

      fetchPOP_Results = yolo[0].data.concat(yolo[1].data, yolo[2].data);

      if (fetchPOP_Results.length >= 1) {
        result2 = fetchPOP_Results.map(function (el) {
          var p = Object.assign({}, el);
          p.rating = el.rating.percentage / 10;
          p.medium_cover_image = el.images.poster;
          p.imdb_code = el.imdb_id;
          return p;
        });
      }

      if (fetchYTS_Results.length >= 1) {
        result = fetchYTS_Results.map(function (el) {
          var o = Object.assign({}, el);
          o.sitesrc = 'yts';
          return o;
        });
      }
      result = result.concat(result2);
    }

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
