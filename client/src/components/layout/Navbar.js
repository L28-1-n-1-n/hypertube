import React, { Fragment } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import logo from '../../img/logo.png';
export const Navbar = ({
  auth: { isAuthenticated, loading, user },
  logout,
}) => {
  const authLinks = (
    <div className="nav-item dropdown">
      <button className="nav-link dropdown-toggle btn btn-outline-secondary" id="header-account-menu-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menu</button>
      <div className="dropdown-menu account-menu bg-dropdown" aria-labelledby="header-account-menu-link">
        <Link className="dropdown-item" to="/homepage">{user && (user.lang === "en" ? 'Home' : user.lang === "fr" ? 'Accueil' : 'Inicio')}</Link>
        <Link className="dropdown-item" to="/dashboard">{user && (user.lang === "en" ? 'Dashboard' : user.lang === "fr" ? 'Panel' : 'Configuración')}</Link>
        <button href="#" className="dropdown-item logout-button"
        onClick={() => {
            logout(user._id);
          }}>{user && (user.lang === "en" ? 'Sign out' : user.lang === "fr" ? 'Déconnexion' : 'Cerrar Sesión')}</button>
      </div>
    </div>
  );
  // 'hide-sm' hides small items when we are on mobile devices, to make things responsive
  const guestLinks = (
    <div className='header__sign'>
      <Link to='/login'>Log in</Link>
      <Link to='/register'>Sign up</Link>
    </div>
  );

  return (
    <header id='page-header' className='header px-3'>
      <div className='header__logo'>
        <Link to='/homepage'>
          <img alt='Logo Hypertube' src={logo} />
        </Link>
      </div>

      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </header>
  );
};
// loading is true by default
// it is set to false if we get an error or user has loggedin
// if !loading, then show <Fragment />, else null
// equivalent to { !loading ? '' : null }

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, {
  logout,
})(Navbar);
