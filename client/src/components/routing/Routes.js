import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Homepage from '../home/Homepage';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import EditProfile from '../profile-forms/EditProfile';

import Profile from '../profile/Profile';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import VerificationSuccess from '../verification/VerificationSuccess';
import Recuperation from '../verification/Recuperation';
import Reset from '../verification/Reset';

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

        <PrivateRoute exact path='/profile/:username' component={Profile} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
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
