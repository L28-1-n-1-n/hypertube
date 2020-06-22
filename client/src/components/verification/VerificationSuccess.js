import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { verifyEmail } from '../../actions/verification';

const VerificationSuccess = ({
  verifyEmail,

  match,
}) => {
  useEffect(() => {
    verifyEmail(match.params.token);
  }, [verifyEmail, match.params.token]);

  return (
    <Fragment>
      <h1 className='x-large text-primary-T'>
        <i className='fas fa-check-circle' /> Verification is Successful
      </h1>
      <p className='large'>Please login again.</p>
      <div>{}</div>
    </Fragment>
  );
};

VerificationSuccess.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
};

export default connect(null, { verifyEmail })(VerificationSuccess);
