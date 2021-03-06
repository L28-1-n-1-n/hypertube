import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

export const Dashboard = ({
  auth: { user },
}) => {
  return (
      <Fragment>
        <div className="container row mx-auto d-flex justify-content-center my-4">
          <div className="col-xs-6 btn-group btn-group-lg btn-group-vertical mx-auto">
            <Link to='/homepage' className="btn btn-info rounded my-3" type="submit" name="pictures">{user && (user.lang === "en" ? 'Home' : user.lang === "fr" ? 'Accueil' : 'Inicio')}</Link>
            <Link to="/edit-profile" className="btn btn-info rounded my-3" type="submit" name="preferences">{user && (user.lang === "en" ? 'Settings' : user.lang === "fr" ? 'Paramètres' : 'Configuración')}</Link>
          </div>
        </div>
      </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(
  Dashboard
);
