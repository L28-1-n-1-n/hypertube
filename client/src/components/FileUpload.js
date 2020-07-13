import React, { Fragment, useState } from 'react';
import UploadAlertMessage from './UploadAlertMessage';
import Progress from './Progress';
import PropTypes from 'prop-types';
import axios from 'axios';

import { connect } from 'react-redux';
import { addPhoto } from '../actions/photo';

const FileUpload = ({ addPhoto, user }) => {
  const [file, setFile] = useState('');

  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [uamessage, setUAMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/photos',
        formData,
        {
          headers: {
            'Content-Type':
              `multipart/form-data; boundary=${formData._boundary}`,
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);
          },
        }
      );
      const { fileName, filePath } = res.data;
      if(res.data.retStatus === 'Error') {
        if(res.data.authorized === false && res.data.msg) {
          setUAMessage(res.data.msg)
        }
      }
      else {
        setUploadedFile({ fileName, filePath });
        setUAMessage('File Uploaded');
        addPhoto(formData);
      }
    } catch (err) {
      if (err.response.status === 500) {
        setUAMessage('There was a problem with the server');
      } else {
        setUAMessage(err.response.data.msg);
      }
    }
  };
  return (
    <Fragment>
      {uamessage ? <UploadAlertMessage msg={uamessage} /> : null}
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <div className='custom-file mb-4'>
            <input
              type='file'
              className='custom-file-input'
              id='file'
              name='file'
              accept="image/jpeg, image/png, image/jpg, image/JPEG, image/PNG, image/JPG"
              onChange={(e) => onChange(e)}
            />

            <label className='custom-file-label' htmlFor='customFile'>
              {filename}
            </label>
          </div>

          <Progress percentage={uploadPercentage} />

          <input
            type='submit'
            value={user && (user.lang === "en" ? 'Upload' : user.lang === "fr" ? 'Télécharger' : 'Cargar')}
            className='btn btn-primary btn-block mt-4'
          />
        </div>
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

FileUpload.propTypes = {
  addPhoto: PropTypes.func.isRequired,
};

export default connect(null, { addPhoto })(FileUpload);
