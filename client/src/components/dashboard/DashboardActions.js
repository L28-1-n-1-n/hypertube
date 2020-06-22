import React from 'react';
import { Link } from 'react-router-dom';
export const DashboardActions = ({ profile: { user: _id } }) => {
  let userId = _id._id;

  return (
    <div className='dash-buttons'>
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-cog text-primary'></i> Edit Profile
      </Link>
      <Link to='/filters' className='btn btn-light'>
        <i className='fas fa-images text-primary'></i> Matching Criteria
      </Link>
      <Link to='/recent-profiles' className='btn btn-light'>
        <i className='fas fa-images text-primary'></i> Recent Profiles
      </Link>
      <Link to='/connected-users' className='btn btn-light'>
        <i className='fas fa-images text-primary'></i> Connected Profiles
      </Link>
      <Link to='/my-photos' className='btn btn-light'>
        <i className='fas fa-images text-primary'></i> My Photos
      </Link>
      <Link to={`/profile/${userId}`} className='btn btn-light'>
        <i className='fas fa-user-circle text-primary'></i> View My Profile
      </Link>
    </div>
  );
};

export default DashboardActions;
