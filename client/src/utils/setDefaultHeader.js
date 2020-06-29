import axios from 'axios';

const setDefaultHeader = () => {
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axios.defaults.withCredentials = true;
};

export default setDefaultHeader;
