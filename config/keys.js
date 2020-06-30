// const FORTYTWO = {
//   clientID: '8d8755781b947dc57742bb1a4683f46c50ecfb8f0153950e16c92b1d12320a9c',
//   clientSecret:
//     '15f27d35517d81c1f225508a2480056261457bec17a9e695402dd8aeb668a8b6',
// };

// const GITHUB = {
//   clientID: '9c4ca4e91c36b7692f63',
//   clientSecret: '5ba9d331928e964920bbd8dd754f0382d23b0b38',
// };

// module.exports = {
//   ...FORTYTWO,
//   ...GITHUB,
// };

const FORTYTWO = {
  fortyTwoClientID:
    '8d8755781b947dc57742bb1a4683f46c50ecfb8f0153950e16c92b1d12320a9c',
  fortyTwoClientSecret:
    '15f27d35517d81c1f225508a2480056261457bec17a9e695402dd8aeb668a8b6',
};

const GITHUB = {
  githubClientID: '9c4ca4e91c36b7692f63',
  githubClientSecret: '5ba9d331928e964920bbd8dd754f0382d23b0b38',
  // githubClientID: 'Iv1.b0d21b8102c287bd',
  // githubClientSecret: '1105833ef4d6825c8628b1f12689aa7458a25195',
};

const KEYS = {
  ...FORTYTWO,
  ...GITHUB,
};
module.exports = KEYS;
