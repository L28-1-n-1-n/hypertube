import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import GalleryPhotoItem from './GalleryPhotoItem';

import { getRecentPhotos } from '../../actions/photo';
import { getCurrentProfile } from '../../actions/profile';

const RecentProfiles = ({
  getCurrentProfile,
  getRecentPhotos,
  photo: { photos, loading },
  profile: { profile },
}) => {
  let ProfilePics = photos;
  useEffect(() => {
    getCurrentProfile();
    getRecentPhotos();
  }, []);

  // Get profile pics of other users, excluding my own

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary-T'>Recent Profiles</h1>
          <p className='lead'>
            <i className='fas fa-heartbeat' /> You recently checked out these
            profiles
          </p>
          <div className='photo-collection'>
            {ProfilePics &&
              ProfilePics.map((photo) => (
                <GalleryPhotoItem
                  key={photo._id}
                  photo={photo}
                  myProfile={profile}
                />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

RecentProfiles.propTypes = {
  getRecentPhotos: PropTypes.func.isRequired,
  photo: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  photo: state.photo,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getRecentPhotos,
  getCurrentProfile,
})(RecentProfiles);
