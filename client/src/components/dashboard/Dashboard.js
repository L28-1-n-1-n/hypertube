import React, { Fragment, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  console.log(user);

  return loading && profile == null ? (
    <Spinner />
    ) : (
      <Fragment>
        <div className="container row mx-auto d-flex justify-content-center my-4">
          <div className="col-xs-6 btn-group btn-group-lg btn-group-vertical mx-auto">
            <Link to='/homepage' className="btn btn-info rounded my-3" type="submit" name="pictures">Home</Link>
            <Link to="/edit-profile" className="btn btn-info rounded my-3" type="submit" name="preferences">Settings</Link>
            <Link to='/my-photos' className="btn btn-info rounded my-3" type="submit" name="pictures">Pictures</Link>
          </div>
        </div>
      </Fragment>
    );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  justCreatedProfile: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  justCreatedProfile: state.auth.justCreatedProfile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
