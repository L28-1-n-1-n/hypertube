import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const MyProfile = ({
  profile: {
    bio,
    tags,
    user: { firstname },
  },
}) => (
  <div className='profile-about bg-light p-2'>
    {bio && (
      <Fragment>
        <h2 className='text-primary-T'>{firstname}'s Bio</h2>
        <p>{bio}</p>
        <div className='line'></div>
      </Fragment>
    )}

    <h2 className='text-primary-T'>Interests</h2>
    <div className='tags'>
      {/* map tags array to individual item for each skill */}
      {tags.map((tag, index) => (
        <div key={index} className='p-1'>
          <i className='fas fa-crosshairs'></i> {tag}
        </div>
      ))}
    </div>
  </div>
);
MyProfile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default MyProfile;
