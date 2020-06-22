import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfilePhotoItem from '../photos/ProfilePhotoItem';
import { getProfileById, reportFake } from '../../actions/profile';
import { getAllPhotosById } from '../../actions/photo';

const Profile = ({
  reportFake,
  getProfileById,
  getAllPhotosById,
  profile: { profile, loading },
  photo: { photos },
  auth,
  match,
}) => {
  useEffect(() => {
    console.log(match.params.id);
    getProfileById(match.params.id);

    getAllPhotosById(match.params.id);
  }, [getProfileById, match.params.id, getAllPhotosById]);
  let SquarePics;
  if (photos) {
    SquarePics = photos.filter((photo) => photo.isProfilePic === false);
  }

  // Runs immediately when profile mounts
  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} photo={photos} />
            <ProfileAbout profile={profile} />
            <div className='profile-photo-collection'>
              {SquarePics &&
                SquarePics.map((photo) => (
                  <ProfilePhotoItem key={photo._id} photo={photo} />
                ))}
            </div>
            <Link to='/photos' className='btn btn-light'>
              Back to Matches
            </Link>
            {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user._id === profile.user._id && (
                <Link to='/edit-profile' className='btn btn-dark'>
                  Edit Profile
                </Link>
              )}{' '}
            <button
              onClick={() => {
                reportFake(profile.user._id);
              }}
              type='button'
              className='btn btn-danger'
            >
              <i className='fas fa-ban' /> {'Report Fake Profile'}
            </button>
          </div>
        </Fragment>
      )}
    </Fragment>
    // Spinner: UI does not render until data is loading
    // If user is authenticated and looks at his own profile, generate Edit Profile button
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  reportFake: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  photo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
  photo: state.photo,
});

export default connect(mapStateToProps, {
  getProfileById,
  getAllPhotosById,
  reportFake,
})(Profile);
