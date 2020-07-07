import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fpCheckEmail } from '../../actions/verification';

const Recuperation = ({ fpCheckEmail }) => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    fpCheckEmail({ email });
  };

  // Redirect if logged in

  return (
    <Fragment>
      <div className="container row mx-auto d-flex flex-column align-items-center my-4">
          <div className="col-9 col-md-8 col-lg-5 shadow__light px-5 py-3 my-4 mx-1 rounded">
              <div className="row justify-content-center my-3">
                  <h3>Reset password</h3>
              </div>
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className="col-12">
                    <div className="formContent">
                        <input
                          type='email'
                          className='formContent__input'
                          name='email'
                          autoComplete="off"
                          value={email}
                          onChange={(e) => onChange(e)}
                          required
                        />
                        <label className="formContent__label" htmlFor="email"><span className="formContent__label__name">Email linked to your account</span></label>
                    </div>
                    <div className="text-center my-3">
                        <button className="btn btn-primary" type="submit">Confirm</button>
                    </div>
                  </div>
                  </form>
          </div>
      </div>
    </Fragment>
  );
};

Recuperation.propTypes = {
  fpCheckEmail: PropTypes.func.isRequired,
};

export default connect(null, { fpCheckEmail })(Recuperation);
