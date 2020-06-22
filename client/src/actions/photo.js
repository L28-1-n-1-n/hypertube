import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PHOTOS,
  GET_MY_PHOTOS,
  PHOTO_ERROR,
  CLEAR_MY_PHOTOS,
  CLEAR_PHOTOS,
  CLEAR_PROFILE,
  UPDATE_LIKES,
  DELETE_PHOTO,
  GET_PHOTO,
  MAKE_PROFILE_PIC,
  GET_PROFILE_PIC_BY_ID,
  GET_ALL_PHOTOS_BY_ID,
  ADD_CLICKED_BY,
  FIRST_PHOTO_UPLOADED,
  ADD_LIKED_BY,
  GET_FILTERED_PHOTOS,
  ADD_NOTIFICATION_LIKE,
  GET_RECENT_PHOTOS,
  GET_CONNECTED_PHOTOS,
} from './types';

// Get photos
export const getPhotos = () => async (dispatch) => {
  dispatch({ type: CLEAR_PHOTOS });
  try {
    const res = await axios.get('/api/photos');
    dispatch({
      type: GET_PHOTOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get filtered photos
export const getFilteredPhotos = () => async (dispatch) => {
  dispatch({ type: CLEAR_PHOTOS });
  // dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get('/api/photos/filteredMatches');
    dispatch({
      type: GET_FILTERED_PHOTOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Recent photos
export const getRecentPhotos = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/photos/recentPhotos');

    dispatch({
      type: GET_RECENT_PHOTOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Connected photos
export const getConnectedPhotos = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/photos/connectedPhotos');

    dispatch({
      type: GET_CONNECTED_PHOTOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get current users photos
export const getMyPhotos = (userId) => async (dispatch) => {
  try {
    // make request to backend api/photos/me
    const res = await axios.get('/api/photos/me');

    dispatch({
      type: GET_MY_PHOTOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: CLEAR_MY_PHOTOS });
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get current users photos
export const getAllPhotosById = (userId) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    // make request to backend api/photos/${userId}/all
    const res = await axios.get(`/api/photos/${userId}/all`);

    dispatch({
      type: GET_ALL_PHOTOS_BY_ID,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: CLEAR_MY_PHOTOS });
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get photo by ID
export const getProfilePicById = (userId) => async (dispatch) => {
  try {
    // make request to backend api/profile/user/${userId}/profilepic
    const res = await axios.get(`/api/photos/${userId}/profilepic`);

    dispatch({
      type: GET_PROFILE_PIC_BY_ID,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: CLEAR_MY_PHOTOS });
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add like
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/photos/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
      payload: { msg: 'server error', status: 500 },
    });
  }
};

// Add LikedBy
export const addLikedBy = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/photos/likedby/${id}`);

    dispatch({
      type: ADD_LIKED_BY,
      payload: { id, likedBy: res.data },
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
      payload: { msg: 'server error', status: 500 },
    });
  }
};

// Add Notification
export const addNotification = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/photos/notifylike/${id}`);

    dispatch({
      type: ADD_NOTIFICATION_LIKE,
      payload: { id, notifcations: res.data },
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
      payload: { msg: 'server error', status: 500 },
    });
  }
};

// Remove like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/photos/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Information that one user clicked the profile of another user
export const addClickedBy = (targetProfileID, myUserID) => async (dispatch) => {
  try {
    const res = await axios.put(
      `/api/photos/clicked/${targetProfileID}/${myUserID}`
    );

    dispatch({
      type: ADD_CLICKED_BY,
      payload: { targetProfileID, myUserID, checkedOutBy: res.data },
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
      payload: { msg: 'server error', status: 500 },
    });
  }
};

// Delete photo
export const deletePhoto = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/photos/${id}`);

    dispatch({
      type: DELETE_PHOTO,
      payload: id,
    });

    dispatch(setAlert('Photo Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add photo alert
export const addPhoto = () => (dispatch) => {
  try {
    dispatch(setAlert('Photo added', 'success'));
    dispatch({ type: FIRST_PHOTO_UPLOADED });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    // }
  }
};

// Get photo
export const getPhoto = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/photos/${id}`);

    dispatch({
      type: GET_PHOTO,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Make this picture the profile pic
export const makeProfilePic = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/photos/isProfilePic/${id}`);

    dispatch({
      type: MAKE_PROFILE_PIC,
      payload: { id, isProfilePic: res.data },
    });
    dispatch(setAlert('Profile Picture set', 'success'));
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      // payload: { msg: err.response.statusText, status: err.response.status },
      payload: { msg: 'server error', status: 500 },
    });
  }
};
