import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';
import { updateUser } from '../../actions/auth';

const initialState = {
  lang: '',
  username: '',
  firstname: '',
  lastname: '',
  email: '',
};
const EditProfile = ({
  profile: { profile, loading },
  auth: { user },
  createProfile,
  updateUser,
  getCurrentProfile,
  history,
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    console.log(profile);
    if (!loading) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in user) {
        if (key in profileData) profileData[key] = user[key];
      }
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile, user]);

  // The prop to depend on is loading, setFormData will run when it is loaded
  const {
    lang,
    username,
    firstname,
    lastname,
    email,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    createProfile(formData, history, true);
    updateUser(formData, history, user._id);
  };
  return (
    <Fragment>
<div id="edit-profile" className="container row mx-auto d-flex justify-content-center my-4">
  <div className="col-md-7 col-sm-10 col-10 col-lg-5 shadow__light px-5 py-3 my-4 mx-2 rounded">
      <div className="col-12 text-center my-3">
          <h3>Informations</h3>
      </div>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="col-12">
          <div className="formContent">
            <input 
              className="formContent__input" 
              type="text" 
              name="username" 
              value={username}
              onChange={(e) => onChange(e)}
              autoComplete="off" 
              required 
            />
            <label className="formContent__label" htmlFor="username"><span className="formContent__label__name">Username</span></label>
          </div>
          <div className="formContent">
            <input 
              className="formContent__input" 
              type="text" 
              name="firstname" 
              value={firstname}
              onChange={(e) => onChange(e)}
              autoComplete="off" 
              required 
            />
            <label className="formContent__label" htmlFor="firstname"><span className="formContent__label__name">Firstname</span></label>
          </div>
          <div className="formContent">
            <input 
              className="formContent__input" 
              type="text" 
              name="lastname" 
              value={lastname}
              onChange={(e) => onChange(e)}
              autoComplete="off" 
              required 
            />
            <label className="formContent__label" htmlFor="lastname"><span className="formContent__label__name">Lastname</span></label>
          </div>
          <div className="formContent">
            <input 
              className="formContent__input" 
              type="email" 
              name="email-address" 
              value={email}
              onChange={(e) => onChange(e)}
              autoComplete="off" 
              required 
            />
            <label className="formContent__label" htmlFor="email-address"><span className="formContent__label__name">Email address</span></label>
          </div>
          <div>
            <p>Language</p>
            <div>
              <input 
                type="radio" 
                id="english" 
                name="lang" 
                value="en" 
                checked={lang == 'en' ? true : false}
                onChange={(e) => onChange(e)}
              />
              <label htmlFor="english">English</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="french" 
                name="lang" 
                value="fr"
                checked={lang == 'fr' ? true : false}
                onChange={(e) => onChange(e)}
              />
              <label htmlFor="french">French</label>
            </div>
            <div>
              <input 
                type="radio" 
                id="spanish" 
                name="lang" 
                value="es"
                checked={lang == 'es' ? true : false}
                onChange={(e) => onChange(e)}
              />
              <label htmlFor="spanish">Spanish</label>
            </div>
          </div>
          <div className="col-xs-6 text-center my-3">
            <button type="submit" className="btn btn-primary">Update</button>
          </div>
        </div>
      </form>
  </div>
  <div className="col-md-7 col-sm-10 col-10 col-lg-5 shadow__light px-5 py-3 my-4 mx-2 rounded">
    <div className="col-12 text-center my-3">
        <h3>Password</h3>
    </div>
    <form onSubmit={(e) => onSubmit(e)}>
      <div className="col-12">
        <div className="formContent">
          <input 
            className="formContent__input" 
            type="password" 
            name="password" 
            onChange={(e) => onChange(e)}
            maxLength="25" 
            required 
          />
          <label className="formContent__label" htmlFor="password"><span className="formContent__label__name">Password</span></label>
        </div>
        <div className="formContent">
          <input 
            className="formContent__input" 
            type="password" 
            name="password2" 
            onChange={(e) => onChange(e)}
            maxLength="25" 
            required 
          />
          <label className="formContent__label" htmlFor="password2"><span className="formContent__label__name">Confirm password</span></label>
        </div>
        <div className="col-xs-6 text-center my-3">    
          <button type="submit" className="btn btn-primary">Update password</button>
        </div>
      </div>
    </form>
    <hr/>
    <div className="col-12 text-center my-3">
      <h3>Picture</h3>
    </div>
    <form encType="multipart/form-data" action="updateAvatar">
      <div className="col-12">
          <div className="form-group btn btn-rounded">
            <label htmlFor="">Image :</label>
            <input 
              className="form-control-file" 
              type="file" 
            />
          </div>
          <div className="col-xs-6 text-center my-3">
              <button type="submit" className="btn btn-primary">Add</button>
          </div>
      </div>
    </form>
  </div>
</div>
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  updateUser,
  createProfile,
  getCurrentProfile,
})(withRouter(EditProfile));

// EditProfile is wrapped in withRouter() to enable use of "history" action
