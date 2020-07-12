import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { checkExpiration } from '../../actions/player';

export const Landing = ({ isAuthenticated, checkExpiration }) => {
  useEffect(() => {
    checkExpiration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <div className='container row mx-auto d-flex flex-column justify-content-center align-items-center my-4'>
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
  checkExpiration: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { checkExpiration })(Landing);
