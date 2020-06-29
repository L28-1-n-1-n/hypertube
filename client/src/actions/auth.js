import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  UPDATE_USER,
  PROFILE_ERROR,
  NOTIFICATION_REMOVAL_ERROR,
  DELETE_NOTIFICATIONS,
  UPDATE_PWD,
  PWD_ERROR,
} from './types';
import setAuthToken from '../utils/setAuthToken';
import setDefaultHeader from '../utils/setDefaultHeader';

import { socket } from './socClient';

// Load User
export const loadUser = () => async (dispatch) => {
  // if (localStorage.token) {
  //   setAuthToken(localStorage.token);
  if (sessionStorage.token) {
    setAuthToken(sessionStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data, // data of the user loaded
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Remove Notifications
export const removeNotifications = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/users/notifications/${id}`);

    dispatch({
      type: DELETE_NOTIFICATIONS,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_REMOVAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Register User
export const register = ({
  firstname,
  lastname,
  username,
  email,
  password,
}) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    firstname,
    lastname,
    username,
    email,
    password,
  });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(
      setAlert(
        'Please check your email and click on verification link.',
        'success'
      )
    );
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (username, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post('/api/auth', body, config); // make POST request to /api/auth, sending body and config

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = (userID) => async (dispatch) => {
  await socket.emit('logout_disconnect', userID);
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Update user
export const updateUser = (formData, history, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/users/${id}`, formData, config);

    dispatch({
      type: UPDATE_USER,
      payload: res.data,
    });

    dispatch(setAlert('User Details Updated', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update users's password
export const updatePwd = (formDataTwo, history, id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(
      `/api/users/resetPWD/${id}`,
      formDataTwo,
      config
    );

    console.log('formdata from updatepwd method below');
    console.log(formDataTwo);
    dispatch({
      type: UPDATE_PWD,
      payload: res.data,
    });

    dispatch(setAlert('Password updated', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    console.log(formDataTwo);
    dispatch({
      type: PWD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Register via Github OAuth
export const registerGithub = () => async () => {
  console.log('front reached2');
  window.location.href = `http://localhost:5000/api/auth/auth/github`;

  try {
    // const config = {
    //   headers: {
    //     // Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     // 'Access-Control-Allow-Origin': '*',
    //     // 'Access-Control-Allow-Credentials': true,
    //     // // Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
    //     // 'X-CSRF-TOKEN': document
    //     //   .querySelector('meta[name="csrf-token"]')
    //     //   .getAttribute('content'),
    //   },
    // };
    // const res = await axios.get(
    //   `http://localhost:5000/api/auth/auth/github`,
    //   config
    // );
    const config = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const res = await axios.get(
      `https://github.com/login/oauth/authorize?response_type=code&client_id=9c4ca4e91c36b7692f63`,
      // `https://github.com/login?client_id=9c4ca4e91c36b7692f63&return_to=%2Flogin%2Foauth%2Fauthorize%3Fclient_id%3D9c4ca4e91c36b7692f63%26response_type%3Dcode`,
      config
    );

    console.log(res);
    // dispatch({
    //   type: DELETE_NOTIFICATIONS,
    //   payload: id,
    // });
  } catch (err) {
    console.log('github error');
    console.log(err);
  }
};

// export const registerGithub = () => {
//   fetch('http://localhost:5000/api/auth/auth/github')
//     .then((response) => response.json()) // one extra step
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((error) => console.error(error));
// };

// export const registerGithub = () => async () => {
//   console.log('front reached');
//   try {
//     // const config = {
//     // headers: {
//     //   // Accept: 'application/json',
//     //   'Content-Type': 'application/json',
//     //   'Access-Control-Allow-Credentials': true,
//     //   // Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
//     //   'X-CSRF-TOKEN': document
//     //     .querySelector('meta[name="csrf-token"]')
//     //     .getAttribute('content'),
//     // },
//     // };
//     // const res = await axios.get(`/api/auth/auth/github`);
//     // var myHeaders = new Headers();
//     // myHeaders.append('Content-Type', 'application/json');

//     var raw = '';
//     var requestOptions = {
//       method: 'GET',
//       headers: {
//         Accept: '*/*',
//         'Content-Type': 'application/json',
//         connection: 'keep-alive',
//         'Access-Control-Allow-Credentials': true,
//         // Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
//         'X-CSRF-TOKEN': document
//           .querySelector('meta[name="csrf-token"]')
//           .getAttribute('content'),
//       },
//       redirect: 'follow',
//     };
//     // const res = await fetch('http://localhost:5000/auth/auth/github', {
//     //   method: 'GET',
//     //   credentials: "include",
//     //   headers: {
//     //     // Accept: 'application/json',
//     //     'Content-Type': 'application/json',
//     //     // 'Access-Control-Allow-Credentials': true,
//     //   },
//     // })
//     //   .then((response) => response.json()) // one extra step
//     //   .then((data) => {
//     //     console.log(data);
//     //   })
//     //   .catch((error) => console.error(error));
//     // console.log(res);
//     const res = await fetch(
//       'http://localhost:5000/api/auth/auth/github',
//       requestOptions
//     )
//       .then((response) => response.text())
//       .then((result) => console.log(result))
//       .catch((error) => console.log('error', error));
//     // console.log(response);
//     // dispatch({
//     //   type: DELETE_NOTIFICATIONS,
//     //   payload: id,
//     // });
//   } catch (err) {
//     console.log('github error');
//     console.log(err);
//   }
// };

// Register via 42 OAuth
// export const registerFortyTwo = () => async () => {
export const registerFortyTwo = () => {
  // setDefaultHeader();
  console.log('front reached3');
  try {
    window.location.href = `http://localhost:5000/api/auth/fortytwo`;
    // console.log('front reached3');
    // console.log(axios.defaults.headers);

    // const config = {
    //   headers: {
    //     // Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     // 'Access-Control-Allow-Origin': '*',
    //     // 'Access-Control-Allow-Credentials': true,
    //     // // Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
    //     // 'X-CSRF-TOKEN': document
    //     //   .querySelector('meta[name="csrf-token"]')
    //     //   .getAttribute('content'),
    //   },
    // };
    // const res = await axios.get(
    //   `http://localhost:5000/api/auth/auth/github`,
    //   config
    // );
    // const config = {
    //   headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    // };
    // const res = await axios.get(
    //   // `https://github.com/login/oauth/authorize?response_type=code&client_id=9c4ca4e91c36b7692f63`
    //   `http://localhost:5000/api/auth/auth/fortytwo`
    //   // `https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A1337%2Fapi%2Fv1%2Fauth%2F42%2Fcallback&client_id=34163cd6c87885d9996267d8e9777e2ae0b8eb83e0bcdc89b0fc3976169fb918`,
    //   // `https://signin.intra.42.fr/users/sign_in?redirect_to=https%3A%2F%2Fapi.intra.42.fr%2Foauth%2Fauthorize%3Fresponse_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A1337%252Fapi%252Fv1%252Fauth%252F42%252Fcallback%26client_id%3D34163cd6c87885d9996267d8e9777e2ae0b8eb83e0bcdc89b0fc3976169fb918`
    //   // config
    // );

    // console.log(res);

    // window.location.href = `https://signin.intra.42.fr/users/sign_in?redirect_to=https%3A%2F%2Fapi.intra.42.fr%2Foauth%2Fauthorize%3Fresponse_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A1337%252Fapi%252Fv1%252Fauth%252F42%252Fcallback%26client_id%3D34163cd6c87885d9996267d8e9777e2ae0b8eb83e0bcdc89b0fc3976169fb918`;

    // dispatch({
    //   type: DELETE_NOTIFICATIONS,
    //   payload: id,
    // });
  } catch (err) {
    console.log('github error');
    console.log(err);
  }
};
