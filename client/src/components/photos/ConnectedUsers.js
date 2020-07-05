import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ConnectedPhotoItem from './ConnectedPhotoItem';
import { getConnectedPhotos } from '../../actions/photo';
import { getCurrentProfile } from '../../actions/profile';

const ConnectedUsers = ({
  getCurrentProfile,
  getConnectedPhotos,
  photo: { photos, loading },
  profile: { profile },
}) => {
  let ProfilePics = photos;
  console.log(profile.correspondances);
  useEffect(() => {
    getCurrentProfile();
    getConnectedPhotos();
  }, []);

  // Get profile pics of other users, excluding my own

  return loading && ProfilePics == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary-T'>Connected Users</h1>
      {profile.correspondances.length !== 0 ? (
        <Fragment>
          <p className='lead'>
            <i className='fas fa-heartbeat' /> You recently connected with these
            users
          </p>
          <div className='photo-collection'>
            {ProfilePics &&
              ProfilePics.map((photo) => (
                <ConnectedPhotoItem
                  key={photo._id}
                  photo={photo}
                  myProfile={profile}
                />
              ))}
          </div>
        </Fragment>
      ) : (
        <p className='lead'>
          <i className='fas fa-heartbeat' /> No connections yet... Start giving
          more likes!
        </p>
      )}
    </Fragment>
  );
};

ConnectedUsers.propTypes = {
  getConnectedPhotos: PropTypes.func.isRequired,
  photo: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  photo: state.photo,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getConnectedPhotos,
  getCurrentProfile,
})(ConnectedUsers);
