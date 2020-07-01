import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Homepage from '../home/Homepage';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import EditProfile from '../profile-forms/EditProfile';
import MyPhotos from '../profile-forms/MyPhotos';

import Profile from '../profile/Profile';
import Photos from '../photos/Photos';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import VerificationSuccess from '../verification/VerificationSuccess';
import Recuperation from '../verification/Recuperation';
import Reset from '../verification/Reset';
import MatchCriteria from '../matchSettings/MatchCriteria';
import Chat from '../chat/Chat';
import ConnectedUsers from '../photos/ConnectedUsers';

import Player from '../player/Player';

const Routes = () => {
  return (
    <div>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <PrivateRoute exact path='/homepage' component={Homepage} />

        <PrivateRoute exact path='/player/:id' component={Player} />

        <PrivateRoute exact path='/profile/:id' component={Profile} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/my-photos' component={MyPhotos} />

        <PrivateRoute exact path='/photos' component={Photos} />
        <PrivateRoute exact path='/filters' component={MatchCriteria} />
        <PrivateRoute
          exact
          path='/connected-users'
          component={ConnectedUsers}
        />
        <PrivateRoute exact path='/chat' component={Chat} />
        <Route
          exact
          path='/confirmation/:token'
          component={VerificationSuccess}
        />
        <Route exact path='/recuperation' component={Recuperation} />
        <Route exact path='/reset/:token' component={Reset} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default Routes;
