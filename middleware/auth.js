const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  console.log(req.header);
  const token = req.header('x-auth-token');
  console.log('token is ', token);
  // Check if not toekn
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('sending error');
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
