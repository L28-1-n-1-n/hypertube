import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { loginByAccessToken } from '../../actions/auth';

const LoginByToken = ({
  auth: { isAuthenticated },
  match,
  loginByAccessToken,
}) => {
  useEffect(() => {
    loginByAccessToken(match.params.accessToken);
  }, [loginByAccessToken, match.params.accessToken]);

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return <Spinner />;
};

LoginByToken.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  loginByAccessToken,
})(LoginByToken);
