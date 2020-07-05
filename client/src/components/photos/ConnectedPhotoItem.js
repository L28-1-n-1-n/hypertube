import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { disconnect } from '../../actions/profile';
import { connect } from 'react-redux';

import {
  addLike,
  addLikedBy,
  removeLike,
  addClickedBy,
} from '../../actions/photo';
import Image from '../Image';

const ConnectedPhotoItem = ({
  addLike,
  addLikedBy,
  removeLike,
  myProfile,
  addClickedBy,
  disconnect,
  auth,
  photo: {
    _id,
    isProfilePic,
    firstname,
    gender,
    user,
    likes,
    date,
    data,
    profile,
  },
  showActions,
}) => {
  let age;
  if (profile.bday) {
    const findAge = () => {
      var dateObj = new Date();
      age = dateObj.getUTCFullYear() - profile.bday.year;
      var month = dateObj.getUTCMonth() + 1 - profile.bday.month; //months from 1-12
      var day = dateObj.getUTCDate() - profile.bday.day;
      return (age = month < 0 ? age - 1 : day < 0 ? age - 1 : age);
    };
    findAge();
  }

  return (
    <div className='photo bg-white p-1 my-1'>
      <div>
        <Link
          to={`/profile/${profile.user}`}
          className='btn btn-primary'
          onClick={() => {
            addClickedBy(profile._id, myProfile.user._id);
          }}
        >
          <Image data={data} />
        </Link>
      </div>
      <div>
        <p className='my-1'>
          {firstname}
          {', '}
          {profile.gender}
          {', '}
          {age}
        </p>
        {profile && profile.location && (
          <p className='my-1'>{profile.location.city}</p>
        )}
        <button type='button' className='btn btn-light'>
          <i className='fas fa-fire-alt' />{' '}
          <span>
            {profile.checkedOutBy &&
              profile.checkedOutBy.length + profile.likedBy.length > 0 && (
                <span>
                  {profile.checkedOutBy.length + profile.likedBy.length}
                </span>
              )}
          </span>
        </button>

        <p className='photo-date'>
          Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <button
              onClick={() => {
                addLike(_id);
                addLikedBy(_id);
              }}
              type='button'
              className='btn btn-light'
            >
              <i className='fas fa-thumbs-up' />{' '}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <button
              onClick={() => removeLike(_id)}
              type='button'
              className='btn btn-light'
            >
              <i className='fas fa-thumbs-down' />
            </button>
            <button
              onClick={() => disconnect(profile.user)}
              type='button'
              className='btn btn-danger'
            >
              <i className='fas fa-times' /> {'Disconnect with '}
              {firstname}
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );
};
// default showActions to be true
ConnectedPhotoItem.defaultProps = {
  showActions: true,
};

ConnectedPhotoItem.propTypes = {
  photo: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired, // To tell whether the current user is owner of this photo
  addLike: PropTypes.func.isRequired,
  addLikedBy: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  addClickedBy: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
  disconnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  addLike,
  addLikedBy,
  removeLike,
  addClickedBy,
  disconnect,
})(ConnectedPhotoItem);
