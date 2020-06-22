import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action; // so we do not have to type action.type and action.payload each time
  switch (type) {
    case SET_ALERT:
      return [...state, payload]; // copy existing alerts, add current alert to the array

    case REMOVE_ALERT: // remove specific alert by its id
      return state.filter(alert => alert.id !== payload); // return all alerts exept the one matching the payload
    default:
      return state;
  }
}
