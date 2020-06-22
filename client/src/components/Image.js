import React, { Fragment, useState, useEffect } from 'react';

const Image = (data) => {
  const [Img, setImg] = useState();
  //   console.log(data.data.data);
  useEffect(() => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(data.data.data));

    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    var base64Flag = 'data:image/jpeg;base64,';
    var imageStr = window.btoa(binary);
    setImg(base64Flag + imageStr);
  }, [data.data.data]);

  return (
    <Fragment>
      <img src={Img} alt='Helpful alt text' />
    </Fragment>
  );
};

export default Image;
