import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    // delete axios.defaults.headers.common['X-Requested-With'];
  }
};

export default setAuthToken;
