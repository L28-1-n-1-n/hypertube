import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fpReset } from '../../actions/verification';
import { setAlert } from '../../actions/alert';
const Reset = ({ setAlert, fpReset, match }) => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });
  const [showText, setShowText] = useState(false);
  const { password, password2 } = formData;

  const token = match.params.token;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger'); // alert type is danger
    } else {
      fpReset({ token, password });
      setShowText(!showText);
    }
  };

  return (
    <Fragment>
      <h1 className='large text-primary-T'>Reset Passowrd</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Please put in a new password.
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Confirm' />
        {showText && (
          <div>
            <p className='lead'>Please login again.</p>
          </div>
        )}
      </form>
    </Fragment>
  );
};

Reset.propTypes = {
  fpReset: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, fpReset })(Reset);
