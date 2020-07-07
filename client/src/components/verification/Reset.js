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
  const { password, password2 } = formData;

  const token = match.params.token;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger'); // alert type is danger
    } else {
      if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/))
      {
        fpReset({ token, password });
      }
      else {
        setAlert('Password must contain at least 4 char including 1 number, caps and low key', 'danger'); // alert type is danger
      }
    }
  };

  return (
    <Fragment>
      <div className="container row mx-auto d-flex flex-column align-items-center my-4">
        <div id="login" className="col-9 col-md-8 col-lg-5 shadow__light px-5 py-3 my-4 mx-1 rounded">
          <div className="row justify-content-center my-3">
              <h3>Reset Passowrd</h3>
          </div>
          <div className="col-12">
          <form className='form' onSubmit={(e) => onSubmit(e)}>
              <div className="formContent">
              <input
                className="formContent__input" 
                type='password'
                autoComplete="off" 
                name='password'
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
                <label className="formContent__label" htmlFor="username"><span className="formContent__label__name">New password</span></label>
              </div>
              <div className="formContent">
                <input
                  className="formContent__input" 
                  type='password'
                  autoComplete="off" 
                  name='password2'
                  value={password2}
                  onChange={(e) => onChange(e)}
                  required
                />
                <label className="formContent__label" htmlFor="password"><span className="formContent__label__name">Confirm password</span></label>
              </div>
              <div className="text-center mb-3">
                <button className="btn btn-primary">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Reset.propTypes = {
  fpReset: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, fpReset })(Reset);
