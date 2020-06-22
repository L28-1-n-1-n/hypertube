import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, editPreferences } from '../../actions/profile';

const initialState = {
  ageStarts: '',
  ageEnds: '',
  preferredTags: '',
  preferredLocation: '',
  preferredDistance: '',
  fameStarts: '',
  fameEnds: '',
};
const MatchCriteria = ({
  profile: { profile, loading },
  auth: { user },
  getCurrentProfile,
  editPreferences,
  history,
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!profile) getCurrentProfile();

    if (!loading) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile]);

  const {
    ageStarts,
    ageEnds,
    preferredTags,
    preferredLocation,
    preferredDistance,
    fameStarts,
    fameEnds,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    editPreferences(formData, history);
  };
  return (
    <Fragment>
      <h1 className='large text-primary-T'>Match Preferences</h1>
      <p className='lead'>
        <i className='fas fa-user-cog'></i>Filter your future matches with the
        following criteria
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Age Starts'
            name='ageStarts'
            value={ageStarts}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>Starting Age</small>
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Age Ends'
            name='ageEnds'
            value={ageEnds}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>Ending Age</small>
        </div>

        <div className='form-group'>
          <input
            type='number'
            placeholder='Fame Starts'
            name='fameStarts'
            value={fameStarts}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>Starting Fame</small>
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Fame Ends'
            name='fameEnds'
            value={fameEnds}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>Ending Fame</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Preferred Location'
            name='preferredLocation'
            value={preferredLocation}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>Preferred Location</small>
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Preferred Distance in km'
            name='preferredDistance'
            value={preferredDistance}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>Preferred Distance in Kilometres</small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='Preferred Interests'
            name='preferredTags'
            value={preferredTags}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            Please enter a list of your preferred interests separated by commas
            (eg. Hiking,Maths,Gardening,Pokemon)
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

MatchCriteria.propTypes = {
  editPreferences: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  editPreferences,
})(withRouter(MatchCriteria));

// MatchCriteria is wrapped in withRouter() to enable use of "history" action
