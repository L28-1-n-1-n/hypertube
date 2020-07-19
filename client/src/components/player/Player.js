import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getMovieById,
  getLangDescription,
  addComment,
  getMovieComments,
  downloadMovie,
  getDownloadedMovie,
} from '../../actions/player';

const Movie = ({
  getMovieById,
  getLangDescription,
  getMovieComments,
  downloadMovie,
  getDownloadedMovie,

  movie: {
    oneMovie,
    langDescription,
    oneMovie: { cast },
    oneMovie: { torrents },
    oneMovie: { movieMagnet },
    movieComments,
  },
  match,
  addComment,
  auth: { user },
}) => {
  const [formData, setFormData] = useState({
    comment: '',
    imdbId: '',
  });

  const [subtitles, updateSubtitles] = useState({});

  var getSubtitles = async () => {
    try {
      const resSubtitles = await axios.get(
        `http://localhost:5000/api/player/subtitles/${match.params.id}`
      );

      if (resSubtitles && resSubtitles.data.subtitles) {
        updateSubtitles(resSubtitles.data.subtitles);
      }
    } catch (err) {}
  };

  useEffect(() => {
    getMovieById(match.params.id);
    getLangDescription(match.params.id,user.lang);
    getMovieComments(match.params.id);
    getDownloadedMovie(match.params.id);
    setFormData({ ...{ imdbId: match.params.id } });
    getSubtitles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getMovieById,
    getLangDescription,
    getMovieComments,
    getDownloadedMovie,
    match.params.id,
    user,
  ]);
  if (torrents && match.params.id === oneMovie.imdb_code) {
    torrents.forEach((torrent) => {
      torrent.magnet = `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURI(
        oneMovie.title
      )}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
      torrent.magnet2 = `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURI(
        oneMovie.title
      )}&tr=http://track.one:1234/announce&tr=udp://tracker.openbittorrent.com:80`;
    });
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(formData);
  };


  return (
    <Fragment>
      <div
        id='player'
        className='container row d-flex mx-auto justify-content-center my-4'
      >
        <div className='videoContent p-0 col-12 col-sm-12 col-md-10 col-lg-8 d-flex flex-column'>
          <div className='video-player shadow-top__light p-2 rounded-top'>
            <img
              className='img-fluid'
              src={oneMovie && oneMovie.background_image}
              alt='Background'
            />
          </div>
          <div className='video-desc d-flex flex-column p-2'>
            {oneMovie &&
            oneMovie.title &&
            oneMovie.imdb_code === match.params.id ? (
              <Fragment>
                <div className='video-desc__details'>
                  <p>
                    <b>
                      {' '}
                      {user &&
                        (user.lang === 'en'
                          ? 'Title'
                          : user.lang === 'fr'
                          ? 'Titre'
                          : 'Título')}
                      : {oneMovie.title}{' '}
                    </b>
                  </p>
                  <p>
                    <b>
                      {(langDescription && 
                      langDescription.overview) ? 
                      langDescription.overview : 
                      (oneMovie && oneMovie.description_intro) ?
                      oneMovie.description_intro :
                      ' '}
                    </b>
                  </p>
                  <p>
                    <b>
                      {user &&
                        (user.lang === 'en'
                          ? 'Casting'
                          : user.lang === 'fr'
                          ? 'Acteurs'
                          : 'Actores')}
                      :{' '}
                      {cast &&
                        cast.map((item, i) => (
                          <span key={i}>{' ' + item.name + ','}</span>
                        ))}
                    </b>
                  </p>
                  <p>
                    <b>
                      {user &&
                        (user.lang === 'en'
                          ? 'Year'
                          : user.lang === 'fr'
                          ? 'Année'
                          : 'Año')}
                      : {oneMovie && oneMovie.year}
                    </b>
                  </p>
                  <p>
                    <b>
                      {user &&
                        (user.lang === 'en'
                          ? 'Duration'
                          : user.lang === 'fr'
                          ? 'Durée'
                          : 'Duración')}
                      : {oneMovie && oneMovie.runtime}min
                    </b>
                  </p>
                  <p>
                    <b>
                      {user &&
                        (user.lang === 'en'
                          ? 'Rate'
                          : user.lang === 'fr'
                          ? 'Note'
                          : 'Nota')}
                      : {oneMovie && oneMovie.rating}
                    </b>
                  </p>
                  <p>
                    <b>Seeds: </b>
                    <span>{torrents && torrents[0].seeds}</span>
                  </p>
                </div>

                {oneMovie.downloadedId === match.params.id ? (
                  <video
                    className='video-player'
                    width='100%'
                    controls
                    preload='metadata'
                    controlsList='nodownload'
                  >
                    <source
                      src={
                        movieMagnet
                          ? `http://localhost:5000/api/player/stream/${
                              match.params.id
                            }/${encodeURIComponent(movieMagnet)}`
                          : ''
                      }
                    />

                    {Object.entries(subtitles).map((entry) => (
                      <track
                        label={entry[0]}
                        key={`language-${entry[0]}`}
                        kind='subtitles'
                        srcLang={entry[0]}
                        src={`data:text/vtt;base64, ${entry[1]}`}
                        default={entry[0] === 'en' ? true : false}
                      />
                    ))}
                  </video>
                ) : (
                  <div className='video-desc__details mx-auto'>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        downloadMovie(match.params.id, torrents[0].magnet);
                      }}
                    >
                      <button
                        className='btn btn-hpt icon-download'
                        type='submit'
                      >
                        {user &&
                          (user.lang === 'en'
                            ? 'Download'
                            : user.lang === 'fr'
                            ? 'Télécharger'
                            : 'Descargar')}{' '}
                        ({torrents && torrents[0].size})
                      </button>
                    </form>
                  </div>
                )}
              </Fragment>
            ) : (
              ''
            )}
          </div>
          <div className='video-comment p-2 rounded-bottom'>
            <div className='video-comment__new'>
              <form onSubmit={(e) => onSubmit(e)}>
                <div className='formContent'>
                  <input
                    className='formContent__input'
                    type='text'
                    name='comment'
                    maxLength='500'
                    spellCheck='false'
                    autoComplete='off'
                    onChange={(e) => onChange(e)}
                    required
                  />
                  <label className='formContent__label' htmlFor='comment'>
                    <span className='formContent__label__name'>
                      {user &&
                        (user.lang === 'en'
                          ? 'Your comment'
                          : user.lang === 'fr'
                          ? 'Commentaire'
                          : 'Tu comentario')}
                      ...
                    </span>
                  </label>
                </div>
                <div className='text-center mb-3'>
                  <button type='submit' className='btn btn-primary btn-sm'>
                    {user &&
                      (user.lang === 'en'
                        ? 'Send'
                        : user.lang === 'fr'
                        ? 'Envoyer'
                        : 'Enviar')}
                  </button>
                </div>
              </form>
            </div>
            <hr />
            <div className='video-comment__display my-3'>
              {movieComments &&
                movieComments.map((item, i) => (
                  <div key={i} className='d-flex'>
                    <div className='comment-text d-flex flex-column'>
                      <Link to={'/profile/' + item.username}>
                        {item.username}
                      </Link>
                      <span className='comment-text__text'>{item.text}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Movie.propTypes = {
  getMovieById: PropTypes.func.isRequired,
  getLangDescription: PropTypes.func.isRequired,
  getMovieComments: PropTypes.func.isRequired,
  downloadMovie: PropTypes.func.isRequired,
  getDownloadedMovie: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  movie: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  movie: state.movie,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getMovieById,
  getLangDescription,
  getMovieComments,
  addComment,
  downloadMovie,
  getDownloadedMovie,
})(Movie);
