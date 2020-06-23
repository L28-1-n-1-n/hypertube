import React, { Fragment, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout, removeNotifications } from '../../actions/auth';
import { forceRefresh } from '../../actions/socClient';
import { socket } from '../../actions/socClient';
export const Navbar = ({
  auth: { isAuthenticated, loading, user },
  removeNotifications,
  logout,
}) => {
  const refreshPage = () => {
    var now2 = new Date();
    var refresh = window.localStorage.getItem('refresh');
    var now3 = now2.getTime().valueOf();

    if (now3 - refresh > 8000) {
      window.localStorage.setItem('refresh', now2.getTime().valueOf());
      window.location.reload();
    }
  };

  const MessageItem = ({ thread }) => {
    return (
      <NavLink to={`/profile/${thread.user}`} className='main-nav'>
        {thread.msg}
      </NavLink>
    );
  };

  // React toastify notifications
  const notify = () => {
    if (user && user.notifications && user.notifications.length > 0) {
      user.notifications.forEach(function (thread) {
        if (thread.msg && thread.user) {
          toast(<MessageItem key={thread._id} thread={thread} />, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
      removeNotifications(user._id);
    }
  };

  var socid;
  var connDetails;

  useEffect(() => {
    socid = socket.id;

    if (user && socid) {
      connDetails = { user: user._id, sid: socid };
      socket.emit('conn_transfer', connDetails);
    }

    //Message from server
    socket.on('logchannel', (message) => {
      socid = message;
    });

    socket.on('refreshTarget', (target_ID) => {
      if (user && target_ID === user._id) {
        refreshPage();
      }
    });
  }, [user, socid]);

  const authLinks = (
    <div className="nav-item dropdown">
      <a className="nav-link dropdown-toggle btn btn-outline-secondary" id="header-account-menu-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menu</a>
      <div className="dropdown-menu account-menu bg-dropdown" aria-labelledby="header-account-menu-link">
        <Link className="dropdown-item" to="/homepage">Home</Link>
        <Link className="dropdown-item" to="/account">Settings</Link>
        <Link className="dropdown-item" to="/logout">Sign out</Link>
      </div>
    </div>
  );
  // 'hide-sm' hides small items when we are on mobile devices, to make things responsive
  const guestLinks = (
    <div className="header__sign">
      <Link to='/login'>Log in</Link>
      <Link to='/signup'>Sign up</Link>
    </div>
  );

  return (
    <header id="page-header" className="header px-3">
      <div className="header__logo">
        <Link to="/homepage">
          <img alt="Logo Hypertube" src="" />
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
  removeNotifications: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, {
  logout,
  removeNotifications,
})(Navbar);
