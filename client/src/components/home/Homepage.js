import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchYTS, fetchInfiniteYTS } from '../../actions/home';
import playWhite from '../../img/play_white.png';

const Homepage = ({ fetchYTS, fetchInfiniteYTS, movie: { movies } }) => {
  const [displayMovies, setDisplayMovies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetch, setLastFetch] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({});
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    let search = params.get('search');
    let genre = params.get('genre');
    let rating = params.get('rating');
    let year = params.get('year');
    let order = params.get('order');
    let inputs = { multiple: 1 };
    if (
      !(
        search == null &&
        genre == null &&
        rating == null &&
        year == null &&
        order == null
      )
    ) {
      inputs = {
        search: search,
        genre: genre,
        rating: rating,
        year: year,
        order: order,
        multiple: 1,
      };
      setSearchCriteria(inputs);
    }
    console.log(inputs);
    fetchYTS(inputs);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    // fetchMoreMovies();
    nextItems();
  }, [isFetching]);
  const nextItems = () => {
    setDisplayMovies((prevState) => [
      ...prevState,
      ...movies.slice(prevState.length, prevState.length + 25),
    ]);
    setIsFetching(false);
    fetchMoreMovies();
  };
  useEffect(() => {
    nextItems();
  }, [movies]);
  let lastPos = 0;
  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    )
      return;
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastPos) {
      setIsFetching(true);
    }
    lastPos = st <= 0 ? 0 : st;
  }

  function fetchMoreMovies() {
    if (displayMovies.length === movies.length && lastFetch !== movies.length) {
      console.log('will make api call');
      let params = new URLSearchParams(window.location.search);
      let search = params.get('search');
      let genre = params.get('genre');
      let rating = params.get('rating');
      let year = params.get('year');
      let order = params.get('order');
      let inputs = { multiple: Math.floor(displayMovies.length / 150) + 1 };

      if (
        !(
          search == null &&
          genre == null &&
          rating == null &&
          year == null &&
          order == null
        )
      ) {
        inputs = {
          search: search,
          genre: genre,
          rating: rating,
          year: year,
          order: order,
          multiple: Math.floor(displayMovies.length / 150) + 1,
        };
        setSearchCriteria(inputs);
      }
      console.log(inputs);
      fetchInfiniteYTS(inputs);
      setLastFetch(movies.length);
    }
    // nextItems();
  }
  // Runs immediately when profile mounts
  return (
    <Fragment>
      <div
        id='homepage'
        className='container-fluid justify-content-center my-4 main-content-home'
      >
        <div className='row justify-content-center'>
          <div className='col-12 movies-filters'>
            <form method='get' action='/homepage' acceptCharset='UTF-8'>
              <div className='row justify-content-center mb-3'>
                <div className='col-4'>
                  <div className='formContent'>
                    <input
                      className='formContent__input'
                      id='search'
                      type='text'
                      name='search'
                    />
                    <label className='formContent__label' htmlFor='search'>
                      <span className='formContent__label__name'>
                        Search Term:
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className='row justify-content-center'>
                <div className='col-6'>
                  <div className='row justify-content-between'>
                    <div>
                      <p>Genre:</p>
                      <select name='genre'>
                        <option value='all' defaultValue>
                          All
                        </option>
                        <option value='action'>Action</option>
                        <option value='adventure'>Adventure</option>
                        <option value='animation'>Animation</option>
                        <option value='biography'>Biography</option>
                        <option value='comedy'>Comedy</option>
                        <option value='crime'>Crime</option>
                        <option value='documentary'>Documentary</option>
                        <option value='drama'>Drama</option>
                        <option value='family'>Family</option>
                        <option value='fantasy'>Fantasy</option>
                        <option value='film-noir'>Film-Noir</option>
                        <option value='history'>History</option>
                        <option value='horror'>Horror</option>
                        <option value='music'>Music</option>
                        <option value='musical'>Musical</option>
                        <option value='mystery'>Mystery</option>
                        <option value='romance'>Romance</option>
                        <option value='sci-fi'>Sci-Fi</option>
                        <option value='sport'>Sport</option>
                        <option value='thriller'>Thriller</option>
                        <option value='war'>War</option>
                        <option value='western'>Western</option>
                      </select>
                    </div>
                    <div>
                      <p>Minimum rating:</p>
                      <select
                        className='d-flex m-auto'
                        name='rating'
                        defaultValue='0'
                      >
                        <option value='9'>9</option>
                        <option value='8'>8</option>
                        <option value='7'>7</option>
                        <option value='6'>6</option>
                        <option value='5'>5</option>
                        <option value='4'>4</option>
                        <option value='3'>3</option>
                        <option value='2'>2</option>
                        <option value='1'>1</option>
                        <option value='0'>0</option>
                      </select>
                    </div>
                    <div>
                      <p>Year:</p>
                      <select name='year'>
                        <option value='0'>All</option>
                        <option value='2011_2020'>2011-2020</option>
                        <option value='1991_2010'>1991-2010</option>
                        <option value='1971_1990'>1971-1990</option>
                        <option value='1951_1970'>1951-1970</option>
                        <option value='1900_1950'>1900-1950</option>
                      </select>
                    </div>
                    <div>
                      <p>Order By:</p>
                      <select name='order'>
                        <option value='asc'>Asc</option>
                        <option value='desc'>Desc</option>
                      </select>
                    </div>
                  </div>
                  <div className='text-center my-3'>
                    <button className='btn btn-primary' type='submit'>
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className='col-12'>
            <div className='row justify-content-center'>
              {movies &&
                displayMovies &&
                displayMovies.map((item, i) => (
                  <div
                    key={i}
                    className='filmCard m-1 col-7 col-sm-4 col-md-3 col-lg-2 bg-dark rounded text-center'
                  >
                    <div className='filmCard__top p-1 rounded-top'>
                      <h3>{item.title}</h3>
                    </div>
                    <div className='video_player rounded'>
                      <Link to={'/player/' + item.imdb_code}>
                        <img
                          className='img-fluid'
                          src={playWhite}
                          alt='illustration'
                        />
                      </Link>
                    </div>
                    <div className='filmCard__img'>
                      <img
                        className='img-fluid'
                        src={item.medium_cover_image}
                        alt='illustration'
                      />
                    </div>
                    <div className='filmCard__bottom p-1 rounded-bottom'>
                      <div className='px-2 d-flex justify-content-between'>
                        <span>{item.year}</span>
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {isFetching && 'Loading ...'}
        </div>
      </div>
    </Fragment>
  );
};

Homepage.propTypes = {
  fetchYTS: PropTypes.func.isRequired,
  fetchInfiniteYTS: PropTypes.func.isRequired,
  movie: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  movie: state.movie,
});

export default connect(mapStateToProps, {
  fetchYTS,
  fetchInfiniteYTS,
})(Homepage);
