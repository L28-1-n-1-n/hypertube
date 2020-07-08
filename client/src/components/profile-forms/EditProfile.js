import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { updateUser, updatePwd } from '../../actions/auth';

import FileUpload from '../FileUpload';

const initialState = {
  lang: '',
  username: '',
  firstname: '',
  lastname: '',
  email: '',
};

const initialStateTwo = {
  password: '',
  password2: '',
};

const EditProfile = ({
  auth: { user },
  updateUser,
  updatePwd,
  setAlert,
  history,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [formDataTwo, setFormDataTwo] = useState(initialStateTwo);

  useEffect(() => {
      const profileData = { ...initialState };
      const profileDataTwo = { ...initialStateTwo };

      for (const key in user) {
        if (key in profileData) profileData[key] = user[key];
      }
      setFormData(profileData);
      setFormDataTwo(profileDataTwo);
  }, [user]);

  // The prop to depend on is loading, setFormData will run when it is loaded
  const {
    lang,
    username,
    firstname,
    lastname,
    email,
  } = formData;

  const {
    password,
    password2,
  } = formDataTwo;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateUser(formData, history, user._id);
  };

  return (
    <Fragment>
      <div id="edit-profile" className="container row mx-auto d-flex justify-content-center my-4">
        <div className="col-md-7 col-sm-10 col-10 col-lg-5 shadow__light px-5 py-3 my-4 mx-2 rounded">
            <div className="col-12 text-center my-3">
                <h3>{user && (user.lang === "en" ? 'Informations' : user.lang === "fr" ? 'Informations' : 'Informaciones')}</h3>
            </div>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className="col-12">
                <div className="formContent">
                  <input 
                    className="formContent__input" 
                    type="text" 
                    name="username" 
                    value={username}
                    onChange={(e) => onChange(e)}
                    autoComplete="off" 
                    required 
                  />
                  <label className="formContent__label" htmlFor="username"><span className="formContent__label__name">{user && (user.lang === "en" ? 'Username' : user.lang === "fr" ? 'Pseudo' : 'Nombre de Usuario')}</span></label>
                </div>
                <div className="formContent">
                  <input 
                    className="formContent__input" 
                    type="text" 
                    name="firstname" 
                    value={firstname}
                    onChange={(e) => onChange(e)}
                    autoComplete="off" 
                    required 
                  />
                  <label className="formContent__label" htmlFor="firstname"><span className="formContent__label__name">{user && (user.lang === "en" ? 'Firstname' : user.lang === "fr" ? 'Prénom' : 'Primer Nombre')}</span></label>
                </div>
                <div className="formContent">
                  <input 
                    className="formContent__input" 
                    type="text" 
                    name="lastname" 
                    value={lastname}
                    onChange={(e) => onChange(e)}
                    autoComplete="off" 
                    required 
                  />
                  <label className="formContent__label" htmlFor="lastname"><span className="formContent__label__name">{user && (user.lang === "en" ? 'Lastname' : user.lang === "fr" ? 'Nom' : 'Apellido')}</span></label>
                </div>
                <div className="formContent">
                  <input 
                    className="formContent__input" 
                    type="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => onChange(e)}
                    autoComplete="off" 
                    required 
                  />
                  <label className="formContent__label" htmlFor="email"><span className="formContent__label__name">{user && (user.lang === "en" ? 'Email address' : user.lang === "fr" ? 'Email' : 'Email')}</span></label>
                </div>
                <div>
                  <p>{user && (user.lang === "en" ? 'Language' : user.lang === "fr" ? 'Langue' : 'Idioma')}</p>
                  <div>
                    <input 
                      type="radio" 
                      id="english" 
                      name="lang" 
                      className="mr-2"
                      value="en" 
                      checked={lang === 'en' ? true : false}
                      onChange={(e) => onChange(e)}
                    />
                    <label htmlFor="english">{user && (user.lang === "en" ? 'English' : user.lang === "fr" ? 'Anglais' : 'Inglés')}</label>
                  </div>
                  <div>
                    <input 
                      type="radio" 
                      id="french" 
                      name="lang" 
                      className="mr-2"
                      value="fr"
                      checked={lang === 'fr' ? true : false}
                      onChange={(e) => onChange(e)}
                    />
                    <label htmlFor="french">{user && (user.lang === "en" ? 'French' : user.lang === "fr" ? 'Français' : 'Francés')}</label>
                  </div>
                  <div>
                    <input 
                      type="radio" 
                      id="spanish" 
                      name="lang" 
                      className="mr-2"
                      value="es"
                      checked={lang === 'es' ? true : false}
                      onChange={(e) => onChange(e)}
                    />
                    <label htmlFor="spanish">{user && (user.lang === "en" ? 'Spanish' : user.lang === "fr" ? 'Espagnol' : 'Español')}</label>
                  </div>
                </div>
                <div className="col-xs-6 text-center my-3">
                  <button type="submit" className="btn btn-primary">{user && (user.lang === "en" ? 'Update' : user.lang === "fr" ? 'Actualiser' : 'Actualizar')}</button>
                </div>
              </div>
            </form>
        </div>
        <div className="col-md-7 col-sm-10 col-10 col-lg-5 shadow__light px-5 py-3 my-4 mx-2 rounded">
          <div className="col-12 text-center my-3">
              <h3>{user && (user.lang === "en" ? 'Password' : user.lang === "fr" ? 'Mot de passe' : 'Contraseña')}</h3>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password !== password2) {
              setAlert('Passwords do not match', 'danger'); // alert type is danger
            } else {
              if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/))
              {
                updatePwd(formDataTwo, history, user._id);
              }
              else {
                setAlert('Password must contain at least 4 char including 1 number, caps and low key', 'danger'); // alert type is danger
              }
            }
          }} >
            <div className="col-12">
              <div className="formContent">
                <input 
                  className="formContent__input" 
                  type="password" 
                  name="password"
                  value={password}
                  onChange={(e) => setFormDataTwo({ ...formDataTwo, [e.target.name]: e.target.value })}
                  maxLength="25" 
                  autoComplete="off"
                  required 
                />
                <label className="formContent__label" htmlFor="password"><span className="formContent__label__name">{user && (user.lang === "en" ? 'Password' : user.lang === "fr" ? 'Mot de passe' : 'Contraseña')}</span></label>
              </div>
              <div className="formContent">
                <input 
                  className="formContent__input" 
                  type="password" 
                  name="password2" 
                  value={password2}
                  onChange={(e) => setFormDataTwo({ ...formDataTwo, [e.target.name]: e.target.value })}
                  maxLength="25" 
                  autoComplete="off"
                  required 
                />
                <label className="formContent__label" htmlFor="password2"><span className="formContent__label__name">{user && (user.lang === "en" ? 'Confirm password' : user.lang === "fr" ? 'Confirmer mot de passe' : 'Confirma contraseña')}</span></label>
              </div>
              <div className="col-xs-6 text-center my-3">    
                <button type="submit" className="btn btn-primary">{user && (user.lang === "en" ? 'Update password' : user.lang === "fr" ? 'Actualiser mot de passe' : 'Actualizar contraseña')}</button>
              </div>
            </div>
          </form>
          <hr/>
          <div className="col-12 text-center my-3">
            <h3>{user && (user.lang === "en" ? 'Picture' : user.lang === "fr" ? 'Photo' : 'Foto')}</h3>
          </div>
          <FileUpload user={user} />
        </div>
      </div>
    </Fragment>
  );
};

EditProfile.propTypes = {
  updateUser: PropTypes.func.isRequired,
  updatePwd: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  updateUser,
  updatePwd,
  setAlert,
})(withRouter(EditProfile));

// EditProfile is wrapped in withRouter() to enable use of "history" action
