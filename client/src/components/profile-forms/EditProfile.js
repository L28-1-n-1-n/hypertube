import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';
import { updateUser } from '../../actions/auth';

const initialState = {
  gender: '',
  interestedGender: '',
  bio: '',
  tags: '',
  bday: '',
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
    gender,
    interestedGender,
    bio,
    tags,
    bday,
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
      <h1 className='large text-primary-T'>Edit Your Profile</h1>
      <p className='lead'>
        <i className='fas fa-user-cog'></i> Modify your information
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* First Name'
            name='firstname'
            value={firstname}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>* First Name</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Last Name'
            name='lastname'
            value={lastname}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>* Last Name</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Email'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>* Email</small>
        </div>
        <div className='form-group'>
          <select name='gender' value={gender} onChange={(e) => onChange(e)}>
            <option value=''>* I identify as ...</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Non-Binary'>Non-Binary</option>
          </select>
        </div>
        <div className='form-group'>
          <select
            name='interestedGender'
            value={interestedGender}
            onChange={(e) => onChange(e)}
          >
            <option value=''>* I am interested in ...</option>
            <option value='Male'>Men</option>
            <option value='Female'>Women</option>
            <option value='Both'>Both</option>
          </select>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='* A few sentences about yourself [Max 200 characters] '
            name='bio'
            value={bio}
            onChange={(e) => onChange(e)}
          ></textarea>
          <small className='form-text'>
            Please write a short bio of yourself
          </small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='* My Interests'
            name='tags'
            value={tags}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            Please enter a list of your interests separated by commas (eg.
            Hiking,Maths,Pokemon)
          </small>
        </div>

        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
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
