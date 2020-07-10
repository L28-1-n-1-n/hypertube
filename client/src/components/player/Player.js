import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getMovieById,
  addComment,
  getMovieComments,
  downloadMovie,
  getDownloadedMovie,
} from '../../actions/player';

const Movie = ({
  getMovieById,
  getMovieComments,
  downloadMovie,
  getDownloadedMovie,
  movie: {
    oneMovie,
    oneMovie: { cast },
    oneMovie: { torrents },
    oneMovie: { moviePath },
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
  useEffect(() => {
    getMovieById(match.params.id);
    getMovieComments(match.params.id);
    getDownloadedMovie(match.params.id);
    setFormData({ ...{ imdbId: match.params.id } });
  }, [
    getMovieById,
    getMovieComments,
    getDownloadedMovie,
    match.params.id,
    user,
  ]);
  console.log(oneMovie);
  console.log(match.params.id);
  console.log(cast);
  console.log(torrents);
  console.log(movieComments);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(formData);
  console.log(moviePath);

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
            <div className='video-desc__details'>
              <p>
                <b>Title: {oneMovie && oneMovie.title}</b>
              </p>
              <p>
                <b>{oneMovie && oneMovie.description_intro}</b>
              </p>
              <p>
                <b>
                  Casting:{' '}
                  {cast &&
                    cast.map((item, i) => (
                      <span key={i}>{' ' + item.name + ','}</span>
                    ))}
                </b>
              </p>
              <p>
                <b>Year: {oneMovie && oneMovie.year}</b>
              </p>
              <p>
                <b>Duration: {oneMovie && oneMovie.runtime}min</b>
              </p>
              <p>
                <b>Rate: {oneMovie && oneMovie.rating}</b>
              </p>
            </div>
            <div className='video-desc__details'>
              {torrents && (
                <p>
                  <span>{torrents[0].quality} </span>
                  <a href={torrents[0].url}>
                    {oneMovie && oneMovie.title_long}
                  </a>
                  <span> {torrents[0].size}</span>
                </p>
              )}
            </div>
            {moviePath ? (
              <video id="videoPlayer" controls muted="muted"> 
                  <source src={moviePath} type="video/mp4" />
              </video>
            ) : (
              <div className='video-desc__details'>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    downloadMovie(match.params.id);
                  }}
                >
                  <button className='btn btn-sm btn-success' type='submit'>
                    Download
                  </button>
                </form>
              </div>
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
                      Your comment...
                    </span>
                  </label>
                </div>
                <div className='text-center mb-3'>
                  <button type='submit' className='btn btn-primary btn-sm'>
                    Send
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
  getMovieComments,
  addComment,
  downloadMovie,
  getDownloadedMovie,
})(Movie);
