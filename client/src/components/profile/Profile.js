import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfilePhotoItem from '../photos/ProfilePhotoItem';
import { getProfileById } from '../../actions/profile';
import { getAllPhotosById } from '../../actions/photo';

const Profile = ({
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
          <div className="container row d-flex justify-content-center my-4 mx-auto">
            <div className="user-profile col-10 col-sm-12 col-md-9 col-lg-7 d-flex flex-column align-items-center bg-dark py-4 rounded">
                <h2>Username</h2>
                <div className="user-photo p-2 bg-darker__light rounded d-flex justify-content-center align-items-center">
                    <img className="img-fluid" src="" alt="Profile picture" />
                </div>
            </div>
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
})(Profile);
