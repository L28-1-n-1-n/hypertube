import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  // dispatch REMOVE_ALERT after 5 seconds (timeout=5000 passed as parameter in setAlert)
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
