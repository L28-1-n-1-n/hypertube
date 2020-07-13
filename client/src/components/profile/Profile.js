import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileByUsername } from '../../actions/profile';

const Profile = ({
  getProfileByUsername,
  profile: { profile },
  match,
}) => {
  useEffect(() => {
    getProfileByUsername(match.params.username);
  }, [getProfileByUsername, match.params.username]);

  // Runs immediately when profile mounts
  return (
    <Fragment>
      <div className="container row d-flex justify-content-center my-4 mx-auto">
        <div className="user-profile col-10 col-sm-12 col-md-9 col-lg-7 d-flex flex-column align-items-center bg-dark py-4 rounded">
            <h2>{profile && profile.username}</h2>
            <div className="user-photo p-2 bg-darker__light rounded d-flex justify-content-center align-items-center">
                <img className="img-fluid" src={profile && profile.filePath} alt="Profile avatar" />
            </div>
        </div>
      </div>
    </Fragment>
    // Spinner: UI does not render until data is loading
    // If user is authenticated and looks at his own profile, generate Edit Profile button
  );
};

Profile.propTypes = {
  getProfileByUsername: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getProfileByUsername,
})(Profile);