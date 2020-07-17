import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchYTS, fetchInfiniteYTS } from '../../actions/home';
import playWhite from '../../img/play_white.png';
import viewed from '../../img/viewed.png';

const Homepage = ({
  fetchYTS,
  fetchInfiniteYTS,
  movie: { movies },
  auth: { user } }) => {
  const [displayMovies, setDisplayMovies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetch, setLastFetch] = useState('');

  function useWindowScrollListener() {
    const handleScroll = useCallback(() => {
      let lastPos = 0;
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
    }, []);
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);
  }
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
        search: null,
        genre: genre,
        rating: rating,
        year: year,
        order: order,
        multiple: 1,
      };
    }
    fetchYTS(inputs);
  }, [fetchYTS]);

  useEffect(() => {
    if (!isFetching) return;
    // fetchMoreMovies();
    nextItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  function fetchMoreMovies() {
    if (
      displayMovies.length > 150 &&
      displayMovies.length === movies.length &&
      lastFetch !== movies.length
    ) {
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
      }
      fetchInfiniteYTS(inputs);
      setLastFetch(movies.length);
    }
    // nextItems();
  }
  useWindowScrollListener();
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
                      {user && (user.lang === "en" ? 'Search:' : user.lang === "fr" ? 'Rechercher :' : 'Buscar:')}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className='row justify-content-center'>
                <div className='col-6'>
                  <div className='row justify-content-between'>
                    <div>
                      <p>{user && (user.lang === "en" ? 'Genre:' : user.lang === "fr" ? 'Genre :' : 'Tipo:')}</p>
                      <select name='genre'>
                        <option value='all' defaultValue>
                        {user && (user.lang === "en" ? 'All' : user.lang === "fr" ? 'Tout' : 'Todo')}
                        </option>
                        <option value='action'>{user && (user.lang === "en" ? 'Action' : user.lang === "fr" ? 'Action' : 'Acción')}</option>
                        <option value='adventure'>{user && (user.lang === "en" ? 'Adventure' : user.lang === "fr" ? 'Aventure' : 'Aventura')}</option>
                        <option value='animation'>{user && (user.lang === "en" ? 'Animation' : user.lang === "fr" ? 'Animation' : 'Animación')}</option>
                        <option value='biography'>{user && (user.lang === "en" ? 'Biography' : user.lang === "fr" ? 'Biographie' : 'Biografía')}</option>
                        <option value='comedy'>{user && (user.lang === "en" ? 'Comedy' : user.lang === "fr" ? 'Comédie' : 'Comedia')}</option>
                        <option value='crime'>{user && (user.lang === "en" ? 'Crime' : user.lang === "fr" ? 'Crime' : 'Crimen')}</option>
                        <option value='documentary'>{user && (user.lang === "en" ? 'Documentary' : user.lang === "fr" ? 'Documentaire' : 'Documental')}</option>
                        <option value='drama'>{user && (user.lang === "en" ? 'Drama' : user.lang === "fr" ? 'Drame' : 'Drama')}</option>
                        <option value='family'>{user && (user.lang === "en" ? 'Family' : user.lang === "fr" ? 'Famille' : 'Familiar')}</option>
                        <option value='fantasy'>{user && (user.lang === "en" ? 'Fantasy' : user.lang === "fr" ? 'Fantaisie' : 'Fantasia')}</option>
                        <option value='film-noir'>{user && (user.lang === "en" ? 'Film-Noir' : user.lang === "fr" ? 'Film-Noir' : 'Película negra')}</option>
                        <option value='history'>{user && (user.lang === "en" ? 'History' : user.lang === "fr" ? 'Histoire' : 'Historia')}</option>
                        <option value='horror'>{user && (user.lang === "en" ? 'Horror' : user.lang === "fr" ? 'Horreur' : 'Horror')}</option>
                        <option value='music'>{user && (user.lang === "en" ? 'Music' : user.lang === "fr" ? 'Musique' : 'Música')}</option>
                        <option value='musical'>{user && (user.lang === "en" ? 'Musical' : user.lang === "fr" ? 'Musicale' : 'Musical')}</option>
                        <option value='mystery'>{user && (user.lang === "en" ? 'Mystery' : user.lang === "fr" ? 'Mystère' : 'Misterio')}</option>
                        <option value='romance'>Romance</option>
                        <option value='sci-fi'>{user && (user.lang === "en" ? 'Sci-Fi' : user.lang === "fr" ? 'Science-Fiction' : 'Ciencia Ficción')}</option>
                        <option value='sport'>{user && (user.lang === "en" ? 'Sport' : user.lang === "fr" ? 'Sport' : 'Deporte')}</option>
                        <option value='thriller'>Thriller</option>
                        <option value='war'>{user && (user.lang === "en" ? 'War' : user.lang === "fr" ? 'Guerre' : 'Guerra')}</option>
                        <option value='western'>Western</option>
                      </select>
                    </div>
                    <div>
                      <p>{user && (user.lang === "en" ? 'Minimum rating:' : user.lang === "fr" ? 'Note minimum :' : 'Calificación mínima:')}</p>
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
                      <p>{user && (user.lang === "en" ? 'Year:' : user.lang === "fr" ? 'Année :' : 'Año:')}</p>
                      <select name='year'>
                        <option value='0'>{user && (user.lang === "en" ? 'All' : user.lang === "fr" ? 'Tout' : 'Todo')}</option>
                        <option value='2011_2020'>2011-2020</option>
                        <option value='1991_2010'>1991-2010</option>
                        <option value='1971_1990'>1971-1990</option>
                        <option value='1951_1970'>1951-1970</option>
                        <option value='1900_1950'>1900-1950</option>
                      </select>
                    </div>
                    <div>
                      <p>{user && (user.lang === "en" ? 'Order By:' : user.lang === "fr" ? 'Trier par :' : 'Ordenar por:')}</p>
                      <select name='order'>
                        <option value='asc'>{user && (user.lang === "en" ? 'Asc' : user.lang === "fr" ? 'Ascendant' : 'Creciente')}</option>
                        <option value='desc'>{user && (user.lang === "en" ? 'Desc' : user.lang === "fr" ? 'Descendant' : 'Descendente')}</option>
                      </select>
                    </div>
                  </div>
                  <div className='text-center my-3'>
                    <button className='btn btn-primary' type='submit'>
                      {user && (user.lang === "en" ? 'Search' : user.lang === "fr" ? 'Rechercher' : 'Buscar')}
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
                    {user && user.movies.some(m => m['movieId'] === item.imdb_code) ?
                      (<div className='video_player video_player-viewed rounded'>
                      <Link to={'/player/' + item.imdb_code}>
                        <img
                          className='img-fluid'
                          src={viewed}
                          alt='illustration'
                        />
                      </Link>
                      </div>)
                      :
                      (<div className='video_player rounded'>
                        <Link to={'/player/' + item.imdb_code}>
                        <img
                          className='img-fluid'
                          src={playWhite}
                          alt='illustration'
                        />
                      </Link>
                      </div>)
                       }
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
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  movie: state.movie,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  fetchYTS,
  fetchInfiniteYTS,
})(Homepage);
