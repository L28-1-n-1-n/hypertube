import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className="container row mx-auto d-flex flex-column justify-content-center align-items-center my-4">
      <div className='text-center'>
        <h1>Hypertube</h1>
        <p>Find your movie!</p>
      </div>
      <div>
        <Link to='./register' className='btn rounded btn-primary mx-2'>
          Sign Up
        </Link>
        <Link to='./login' className='btn rounded btn-primary mx-2'>
          Login
        </Link>
      </div>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
