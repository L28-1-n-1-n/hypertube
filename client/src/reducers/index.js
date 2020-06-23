import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import photo from './photo';
import confirmation from './confirmation';
import conversation from './conversation';
import movie from './movie';

export default combineReducers({
  alert,
  auth,
  profile,
  photo,
  confirmation,
  conversation,
  movie,
});
