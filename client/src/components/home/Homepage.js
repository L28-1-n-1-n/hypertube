import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchYTS } from '../../actions/home';

const Home = ({
  fetchYTS,
}) => {
  useEffect(() => {
    fetchYTS();
  }, [fetchYTS]);

  // Runs immediately when profile mounts
  return (
    <Fragment>
        <div id="homepage" className="container-fluid justify-content-center my-4 main-content-home">
          <div className="row justify-content-center">
            <div className="col-12 movies-filters">
              <form method="get" action="/homepage" acceptCharset="UTF-8">
              <div className="row justify-content-center mb-3">
                <div className="col-4">
                    <div className="formContent">
                      <input className="formContent__input" id="search" type="text" name="search"/>
                      <label className="formContent__label" htmlFor="search"><span className="formContent__label__name">Search Term:</span></label>
                    </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-6">
                    <div className="row justify-content-between">
                      <div>
                        <p>Genre:</p>
                        <select name="genre">
                          <option value="all" selected>All</option>
                          <option value="action">Action</option>
                          <option value="adventure">Adventure</option>
                          <option value="animation">Animation</option>
                          <option value="biography">Biography</option>
                          <option value="comedy">Comedy</option>
                          <option value="crime">Crime</option>
                          <option value="documentary">Documentary</option>
                          <option value="drama">Drama</option>
                          <option value="family">Family</option>
                          <option value="fantasy">Fantasy</option>
                          <option value="film-noir">Film-Noir</option>
                          <option value="history">History</option>
                          <option value="horror">Horror</option>
                          <option value="music">Music</option>
                          <option value="musical">Musical</option>
                          <option value="mystery">Mystery</option>
                          <option value="romance">Romance</option>
                          <option value="sci-fi">Sci-Fi</option>
                          <option value="sport">Sport</option>
                          <option value="thriller">Thriller</option>
                          <option value="war">War</option>
                          <option value="western">Western</option>
                        </select>
                      </div>
                      <div>
                        <p>Minimum rating:</p>
                        <select className="d-flex m-auto" name="rating">
                          <option value="9">9</option>
                          <option value="8">8</option>
                          <option value="7">7</option>
                          <option value="6">6</option>
                          <option value="5">5</option>
                          <option value="4">4</option>
                          <option value="3">3</option>
                          <option value="2">2</option>
                          <option value="1">1</option>
                          <option value="0" selected>0</option>
                        </select>
                      </div>
                      <div>
                        <p>Year:</p>
                        <select name="year">
                          <option value="0">All</option>
                          <option value="2011_2020">2011-2020</option>
                          <option value="1991_2010">1991-2010</option>
                          <option value="1971_1990">1971-1990</option>
                          <option value="1951_1970">1951-1970</option>
                          <option value="1900_1950">1900-1950</option>
                        </select>
                      </div>
                      <div>
                        <p>Order By:</p>
                        <select name="order">
                          <option value="asc">Asc</option>
                          <option value="desc">Desc</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-center my-3">
                      <button className="btn btn-primary" type="submit">Search</button>
                    </div>
                </div>
              </div>
            </form>
            </div>
            <div className="col-12">
              <div className="row justify-content-center">
                <div className="filmCard m-1 col-7 col-sm-4 col-md-3 col-lg-2 bg-dark rounded text-center">
                  <div className="filmCard__top p-1 rounded-top">
                    <h3>The lord of the rings</h3>
                  </div>
                  <div className="video_player rounded">
                    <Link to="/player/"><img className="img-fluid" src="/img/play_white.png" alt="illustration"/></Link>
                  </div>
                  <div className="filmCard__img">
                    <img className="img-fluid" src="" alt="illustration" />
                  </div>
                  <div className="filmCard__bottom p-1 rounded-bottom">
                    <div className="px-2 d-flex justify-content-between">
                      <span>2003</span>
                      <span>8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Fragment>
  );
};

Home.propTypes = {
  fetchYTS: PropTypes.func.isRequired,
  movie: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  movie: state.movie,
});

export default connect(mapStateToProps, {
  fetchYTS
})(Home); 
