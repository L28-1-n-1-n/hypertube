import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { detailedGeo, createProfile } from '../../actions/profile';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const CreateProfile = ({ auth: { user }, createProfile, history }) => {
  const [formData, setFormData] = useState({
    gender: '',
    interestedGender: '',
    bio: '',
    age: '',
    tags: '',
  });

  const [startDate, setStartDate] = useState('');

  const { gender, interestedGender, bio, age, tags } = formData;
  useEffect(() => {
    // pre-set latitude and longitude to an out-of-range value 200
    // Normally latitude and longitude are +/-90 and +/-180 respectively
    // This value (200) will be replaced by GPS values if navigator.geolocation is allowed by user
    // Otherwise thier value will be updated in the server using guesses by ip address
    // Please see below (towards the end of useEffect()) on arrangements for guessing geolocation by ip address
    setFormData({
      ...formData,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      pre_latitude: 200,
      pre_longitude: 200,
    });

    // Replace error value with latitude and longitude obtained by GPS if user allows navigator.geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            pre_latitude: position.coords.latitude,
            pre_longitude: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.log('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.log('The request to get user location timed out.');
              break;
            case error.UNKNOWN_ERROR:
              console.log('An unknown error occurred.');
              break;
            default:
              break;
          }
        }
      );
    }
  }, []);

  let result = moment(startDate).format('l').toString().split('/');
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      bday: {
        day: Number(result[0]),
        month: Number(result[1]),
        year: Number(result[2]),
      },
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary-T'>Create Your Profile</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Tell us more about you
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <select name='gender' value={gender} onChange={(e) => onChange(e)}>
            <option value='0'>* I identify as ...</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Non-Binary'>Non-Binary</option>
          </select>
        </div>
        <div className='form-group'>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              result = moment(date).format('l').toString().split('/');

              setFormData({
                ...formData,
                bday: {
                  day: Number(result[0]),
                  month: Number(result[1]),
                  year: Number(result[2]),
                },
              });
            }}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
          />
          <small className='form-text'>* Date of Birth</small>
        </div>
        <div className='form-group'>
          <select
            name='interestedGender'
            value={interestedGender}
            onChange={(e) => onChange(e)}
          >
            <option value='0'>* I am interested in ...</option>
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
            Hiking,Maths,Gardening,Pokemon)
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

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  detailedGeo: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { createProfile, detailedGeo })(
  withRouter(CreateProfile, detailedGeo)
);

// CreateProfile is wrapped in withRouter() to enable use of "history" action
