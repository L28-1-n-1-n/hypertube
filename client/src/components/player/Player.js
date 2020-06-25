import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMovieById } from '../../actions/player';

const Movie = ({
    getMovieById,
    movie: { movie },
    match,
  }) => {
    useEffect(() => {
      console.log(match.params.id);
      getMovieById(match.params.id);
    }, [getMovieById, match.params.id]);

  // Runs immediately when profile mounts
  return (
    <Fragment>
      <div id="player" className="container row d-flex mx-auto justify-content-center my-4">
    <div className="videoContent p-0 col-12 col-sm-12 col-md-10 col-lg-8 d-flex flex-column">
        <div className="video-player shadow-top__light p-2 rounded-top">
            <img className="img-fluid" src="/images/waven.png" alt="Background"/>
        </div>
        <div className="video-desc d-flex flex-column p-2">
            <div>
            {movie.title}
            </div>
            <div className="video-desc__details">
                <p><b>Title: </b>title</p>
                <p><b>Casting: </b>cast</p>
                <p><b>Year: </b>year</p>
                <p><b>Duration: </b>runtime min</p>
                <p><b>Rate: </b>rating</p>
            </div>
        </div>
        <div className="video-comment p-2 rounded-bottom">
            <div className="video-comment__new">
                <form action="addComment">
                <div className="formContent">
                    <input className="formContent__input" type="text" name="comment" maxLength="500" spellCheck="false" autoComplete="off" required />
                    <label className="formContent__label" htmlFor="comment"><span className="formContent__label__name">Your comment...</span></label>
                </div>
                <div className="text-center mb-3">
                    <p className="text-danger" v-if="cloudError"><small>An error occured while processing your request. Please check your informations and try again.</small></p>
                </div>
                <div className="text-center mb-3">
                    <button type="submit" className="btn btn-primary btn-sm">Send</button>
                </div>
                </form>
            </div>
            <hr/>
            <div className="video-comment__display my-3">
                <div className="d-flex">
                    <div className="comment-text d-flex flex-column">
                        <span>Thyrse</span>
                        <span className="comment-text__text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quis voluptas, molestiae placeat eligendi totam? Dolor at cum nisi accusamus.</span>
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
    movie: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  movie: state.movie,
});

export default connect(mapStateToProps, {
    getMovieById,
})(Movie);
