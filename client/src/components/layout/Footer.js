import React, { Fragment } from 'react';
import logo from '../../img/logo.png';

const Footer = () => {
  return (
    <Fragment>
        <div className="footer footer-shadow">
            <div className="footer_logo">
                <img src={logo} alt='Logo Hypertube' />
            </div>
        </div>
    </Fragment>
  );
};

export default Footer;
