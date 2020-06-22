import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfilePicById } from '../../actions/photo';
import Image from '../Image';
const ProfileTop = ({
  profile: {
    bday,
    gender,
    location: { city },
    user: { _id, firstname, lastname },
  },
  getProfilePicById,
  photo: { photos },
}) => {
  let myProfilePic;
  let age;
  if (bday) {
    const findAge = () => {
      var dateObj = new Date();
      age = dateObj.getUTCFullYear() - bday.year;
      var month = dateObj.getUTCMonth() + 1 - bday.month; //months from 1-12
      var day = dateObj.getUTCDate() - bday.day;
      return (age = month < 0 ? age - 1 : day < 0 ? age - 1 : age);
    };
    findAge();
  }

  useEffect(() => {
    getProfilePicById(_id);
    myProfilePic = photos.find(
      (element) => element.isProfilePic === true && element.user === _id
    );
  }, [getProfilePicById, myProfilePic]);

  myProfilePic = photos.find(
    (element) => element.isProfilePic === true && element.user === _id
  );

  return (
    <div className='profile-top bg-primary-T p-2'>
      <div>
        {myProfilePic && myProfilePic.data && (
          <Image data={myProfilePic.data} />
        )}
      </div>
      <h1 className='large'>
        {firstname}
        {'  '}
        {lastname}
        {',  '}
        {gender}
        {',  '}
        {age}
      </h1>

      <p className='lead'>{city && <span>{city}</span>}</p>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
  photo: PropTypes.object.isRequired,
  getProfilePicById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  photo: state.photo,
});

export default connect(mapStateToProps, { getProfilePicById })(ProfileTop);
