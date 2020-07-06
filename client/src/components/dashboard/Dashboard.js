import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Dashboard = () => {
  return (
      <Fragment>
        <div className="container row mx-auto d-flex justify-content-center my-4">
          <div className="col-xs-6 btn-group btn-group-lg btn-group-vertical mx-auto">
            <Link to='/homepage' className="btn btn-info rounded my-3" type="submit" name="pictures">Home</Link>
            <Link to="/edit-profile" className="btn btn-info rounded my-3" type="submit" name="preferences">Settings</Link>
          </div>
        </div>
      </Fragment>
  );
};

export default connect()(
  Dashboard
);
