import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieById, addComment } from '../../actions/player';


const initialState = {
  comment: '',
};


const Movie = ({ 
  getMovieById, 
  movie: { oneMovie, oneMovie: { cast }, oneMovie: { torrents } }, 
  match,
  addComment,
  auth: { user },
 }) => {
  const [formData, setFormData] = useState(initialState);
  useEffect(() => {
    const profileData = { ...initialState };
    console.log(match.params.id);
    getMovieById(match.params.id);
    setFormData(profileData);
  }, [getMovieById, match.params.id, user]);
  console.log(oneMovie);
  console.log(match.params.id);
  console.log(cast);
  console.log(torrents);

  const {
    comment,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(formData, match.params.id, user.username);
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
                <b>Casting: {cast && cast.map((item) => <span>{item.name}</span>)}</b>
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
              {torrents && torrents.map((item) => 
              <p>
                <span>{item.quality} </span>
                <a href={item.url}>{oneMovie && oneMovie.title_long}</a>
                <span> {item.size}</span>
              </p>)}
            </div>
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
                    value={comment}
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
                  <p className='text-danger' v-if='cloudError'>
                    <small>
                      An error occured while processing your request. Please
                      check your informations and try again.
                    </small>
                  </p>
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
              <div className='d-flex'>
                <div className='comment-text d-flex flex-column'>
                  <span>Thyrse</span>
                  <span className='comment-text__text'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Facilis quis voluptas, molestiae placeat eligendi totam?
                    Dolor at cum nisi accusamus.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Movie.propTypes = {
  getMovieById: PropTypes.func.isRequired,
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
  addComment,
})(Movie);
