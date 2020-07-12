import React, { Fragment } from 'react';
import fourtyfour from '../../img/404.png';
import fourtygif from '../../img/sorry.gif';

const NotFound = () => {
  return (
    <Fragment>
      <div className="container row mx-auto d-flex align-items-center flex-column my-4 main-content-home">
          <div className="d-flex flex-column align-items-center col-10 col-lg-7 my-4">
              <img className="img-fluid my-4 img_error" src={fourtyfour} alt="404"/>
              <img className="img-fluid" src={fourtygif} alt="sorry"/>
          </div>
          <div className="text-center col-10 col-lg-7 my-4">
              <h3>It seems that you are lost. <a href="/"><u>Click here</u></a> to get back to the homepage.</h3>
          </div>
      </div>
    </Fragment>
  );
};

export default NotFound;
