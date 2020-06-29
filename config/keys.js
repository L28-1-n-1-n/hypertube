const FORTYTWO = {
  fortyTwoClientID:
    // '34163cd6c87885d9996267d8e9777e2ae0b8eb83e0bcdc89b0fc3976169fb918',
    '8d8755781b947dc57742bb1a4683f46c50ecfb8f0153950e16c92b1d12320a9c',
  fortyTwoClientSecret:
    // '83d56a400a0d29c394d12c53334238b5505742f7cfe23606d7fb868272c2416f',
    '15f27d35517d81c1f225508a2480056261457bec17a9e695402dd8aeb668a8b6',
};

const GITHUB = {
  githubClientID: '9c4ca4e91c36b7692f63',
  githubClientSecret: '5ba9d331928e964920bbd8dd754f0382d23b0b38',
  // githubClientID: 'Iv1.b0d21b8102c287bd',
  // githubClientSecret: '1105833ef4d6825c8628b1f12689aa7458a25195',
};

const SESSION = {
  COOKIE_KEY: 'DoubleChocolateChip',
};
const KEYS = {
  ...FORTYTWO,
  ...GITHUB,
  ...SESSION,
};
module.exports = KEYS;
