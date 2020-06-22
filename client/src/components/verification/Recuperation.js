import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fpCheckEmail } from '../../actions/verification';

const Recuperation = ({ fpCheckEmail }) => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [showText, setShowText] = useState(false);
  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    fpCheckEmail({ email });
    setShowText(!showText);
  };

  // Redirect if logged in

  return (
    <Fragment>
      <h1 className='large text-primary-T'>Reset Passowrd</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Please enter the email you registered
        with.
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Email Me' />
        {showText && (
          <div>
            <p className='lead'>
              If the provided email address matches that account's verified
              email address, you'll receive an email with the reset link
              shortly.
            </p>
          </div>
        )}
      </form>
    </Fragment>
  );
};

Recuperation.propTypes = {
  fpCheckEmail: PropTypes.func.isRequired,
};

export default connect(null, { fpCheckEmail })(Recuperation);
