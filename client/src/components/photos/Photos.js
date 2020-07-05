import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import GalleryPhotoItem from './GalleryPhotoItem';
import { getFilteredPhotos } from '../../actions/photo';
import { getCurrentProfile } from '../../actions/profile';

const Photos = ({
  getCurrentProfile,
  getFilteredPhotos,
  photo: { photos, loading },
  profile: { profile },
}) => {
  let ProfilePics = photos;
  const [advancedMetrics, toggleAdvancedMetrics] = useState(false);
  const [rankAge, setRankAge] = useState('');
  const [rankFame, setRankFame] = useState('');
  const [rankDistance, setRankDistance] = useState('');
  const [rankMaxCommonTags, setRankMaxCommonTags] = useState('');
  useEffect(() => {
    getCurrentProfile();
    getFilteredPhotos();
  }, [rankAge, rankFame, rankDistance, rankMaxCommonTags]);

  // Get profile pics of other users, excluding my own

  const ageOlder = () => {
    setRankAge('High');
    setRankFame('Nomal');
    setRankDistance('Normal');
    setRankMaxCommonTags('Normal');
  };
  const ageYounger = () => {
    setRankAge('Low');
    setRankFame('Nomal');
    setRankDistance('Normal');
    setRankMaxCommonTags('Normal');
  };
  const fameLess = () => {
    setRankFame('Low');
    setRankAge('Nomal');
    setRankDistance('Normal');
    setRankMaxCommonTags('Normal');
  };
  const fameHigher = () => {
    setRankFame('High');
    setRankAge('Nomal');
    setRankDistance('Normal');
    setRankMaxCommonTags('Normal');
  };
  const distanceHigher = () => {
    setRankDistance('High');
    setRankFame('Nomal');
    setRankAge('Normal');
    setRankMaxCommonTags('Normal');
  };
  const distanceLower = () => {
    setRankDistance('Low');
    setRankFame('Nomal');
    setRankAge('Normal');
    setRankMaxCommonTags('Normal');
  };
  const maxCommonTagsLower = () => {
    setRankMaxCommonTags('Low');
    setRankFame('Nomal');
    setRankDistance('Normal');
    setRankAge('Normal');
  };
  const maxCommonTagsHigher = () => {
    setRankMaxCommonTags('High');
    setRankFame('Nomal');
    setRankDistance('Normal');
    setRankAge('Normal');
  };
  if (rankAge === 'High') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) => (a.profile.age > b.profile.age ? -1 : 1));
    }
  }
  if (rankAge === 'Low') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) => (a.profile.age > b.profile.age ? 1 : -1));
    }
  }
  if (rankFame === 'Low') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) => (a.profile.fame > b.profile.fame ? 1 : -1));
    }
  }
  if (rankFame === 'High') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) => (a.profile.fame > b.profile.fame ? -1 : 1));
    }
  }
  if (rankDistance === 'High') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) =>
        a.profile.distance > b.profile.distance ? -1 : 1
      );
    }
  }
  if (rankDistance === 'Low') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) =>
        a.profile.distance > b.profile.distance ? 1 : -1
      );
    }
  }
  if (rankMaxCommonTags === 'Low') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) =>
        a.profile.maxCommonTags > b.profile.maxCommonTags ? -1 : 1
      );
    }
  }
  if (rankMaxCommonTags === 'High') {
    if (ProfilePics) {
      ProfilePics.sort((a, b) =>
        a.profile.maxCommonTags > b.profile.maxCommonTags ? 1 : -1
      );
    }
  }
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary-T'>Matches</h1>
          <p className='lead'>
            <i className='fas fa-heartbeat' /> Based on your preferences, here
            are your matches
          </p>

          <div className='my-2'>
            <button
              onClick={() => toggleAdvancedMetrics(!advancedMetrics)}
              type='button'
              className='btn btn-light'
            >
              Advanced Ranking Options
            </button>
          </div>
          {advancedMetrics && (
            <Fragment>
              <div className='my-2'>
                <button className='btn btn-light' onClick={() => ageOlder()}>
                  <i className='fas fa-plus'></i> Older First
                </button>
              </div>

              <div className='my-2'>
                <button className='btn btn-light' onClick={() => ageYounger()}>
                  <i className='fas fa-minus'></i> Younger First
                </button>
              </div>

              <div className='my-2'>
                <button className='btn btn-light' onClick={() => fameLess()}>
                  <i className='fas fa-minus'></i> Lower Fame First
                </button>
              </div>

              <div className='my-2'>
                <button className='btn btn-light' onClick={() => fameHigher()}>
                  <i className='fas fa-plus'></i> Higher Fame First
                </button>
              </div>

              <div className='my-2'>
                <button
                  className='btn btn-light'
                  onClick={() => distanceLower()}
                >
                  <i className='fas fa-plus'></i> Futher First
                </button>
              </div>

              <div className='my-2'>
                <button
                  className='btn btn-light'
                  onClick={() => distanceHigher()}
                >
                  <i className='fas fa-minus'></i> Closer First
                </button>
              </div>

              <div className='my-2'>
                <button
                  className='btn btn-light'
                  onClick={() => maxCommonTagsLower()}
                >
                  <i className='fas fa-minus'></i> Less Common Tags First
                </button>
              </div>

              <div className='my-2'>
                <button
                  className='btn btn-light'
                  onClick={() => maxCommonTagsHigher()}
                >
                  <i className='fas fa-plus'></i> More Common Tags First
                </button>
              </div>
            </Fragment>
          )}
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

Photos.propTypes = {
  getFilteredPhotos: PropTypes.func.isRequired,
  photo: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  photo: state.photo,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getFilteredPhotos,
  getCurrentProfile,
})(Photos);
