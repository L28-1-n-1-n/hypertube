import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(username, password);
    var begin_timestamp = new Date();
    window.localStorage.getItem('refresh');
    window.localStorage.setItem('refresh', begin_timestamp.getTime().valueOf());
  };

  // Redirect if logged in

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <Fragment>
      <div className='container row mx-auto d-flex flex-column align-items-center my-4'>
        <div
          id='login'
          className='col-9 col-md-8 col-lg-5 shadow__light px-5 py-3 my-4 mx-1 rounded'
        >
          <div className='row justify-content-center my-3'>
            <h3>Log in</h3>
          </div>
          <div className='col-12'>
            <form action='login' onSubmit={(e) => onSubmit(e)}>
              <div className='formContent'>
                <input
                  className='formContent__input'
                  type='text'
                  autoComplete='off'
                  name='username'
                  maxLength='15'
                  focus-first='true'
                  value={username}
                  onChange={(e) => onChange(e)}
                  required
                />
                <label className='formContent__label' htmlFor='username'>
                  <span className='formContent__label__name'>Username</span>
                </label>
              </div>
              <div className='formContent'>
                <input
                  className='formContent__input'
                  type='password'
                  name='password'
                  maxLength='25'
                  value={password}
                  onChange={(e) => onChange(e)}
                  required
                />
                <label className='formContent__label' htmlFor='password'>
                  <span className='formContent__label__name'>Password</span>
                </label>
              </div>
              <div className='text-center my-3'>
                <a href='/password/forgot' className='forgot_passwd'>
                  Forgot your password?
                </a>
              </div>
              <div className='text-center mb-3'>
                <button className='btn btn-primary'>Sign in</button>
              </div>
            </form>
          </div>
        </div>
        <div className='col-9 col-md-8 col-lg-5 shadow__light px-5 py-3 my-4 mx-1 rounded'>
          <div className='row justify-content-center my-3'>
            <h3>Log in with:</h3>
          </div>
          <div className='col-12'>
            <div className='text-center mb-3'>
              <a href='http://localhost:5000/api/auth/fortytwo'>
                <button
                  variant='link'
                  className='btn btn-outline-light icon-custom icon-custom__fortytwo'
                  type='button'
                >
                  Login 42
                </button>
              </a>
              {/* <Link to="/auth/42" className="btn btn-outline-light icon-custom icon-custom__fortytwo">Log in</Link> */}
            </div>
            <div className='text-center mb-3'>
              <a href='http://localhost:5000/api/auth/github'>
                <button
                  variant='link'
                  className='btn btn-outline-light icon-custom icon-custom__fortytwo'
                  type='button'
                >
                  Login Github
                </button>
              </a>
              {/* <Link
                to='api/auth/github'
                className='btn btn-outline-light icon-custom icon-custom__github'
              >
                Log in
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
