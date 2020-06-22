import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { connect } from 'react-redux';
import {
  addLike,
  removeLike,
  deletePhoto,
  makeProfilePic,
  addLikedBy,
} from '../../actions/photo';
import Image from '../Image';

const PhotoItem = ({
  addLike,
  addLikedBy,
  removeLike,
  deletePhoto,
  makeProfilePic,
  auth,
  photo: { _id, isProfilePic, firstname, user, likes, date, data },
  showActions,
}) => {
  return (
    <div className='photo bg-white p-1 my-1'>
      <div>
        <Image data={data} />
      </div>
      <div>
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
              onClick={() => makeProfilePic(_id)}
              type='button'
              className='btn btn-primary'
            >
              Make Profile Picture
            </button>
            {/* To tell whether the current user is owner of this photo, if yes then display delete button */}
            {!auth.loading && user === auth.user._id && (
              <button
                onClick={() => deletePhoto(_id)}
                type='button'
                className='btn btn-danger'
              >
                <i className='fas fa-times' />
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

// default showActions to be true
PhotoItem.defaultProps = {
  showActions: true,
};

PhotoItem.propTypes = {
  photo: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired, // To tell whether the current user is owner of this photo, if yes then display delete button
  addLike: PropTypes.func.isRequired,
  addLikedBy: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePhoto: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
  makeProfilePic: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  addLike,
  addLikedBy,
  removeLike,
  deletePhoto,
  makeProfilePic,
})(PhotoItem);
