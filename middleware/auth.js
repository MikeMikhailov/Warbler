/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (decodedToken) {
        return next();
      }
      return next({
        status: 401,
        message: 'You are not authenticated. Please log in',
      });
    });
  } catch (err) {
    return next({
      status: 401,
      message: 'You are not authenticated. Please log in',
    });
  }
}

function isAuthorized(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (decodedToken && decodedToken.id === req.params.id) {
        return next();
      }
      return next({
        status: 401,
        message: 'You are not authorized to do this',
      });
    });
  } catch (err) {
    return next({
      status: 401,
      message: 'You are not authorized to do this',
    });
  }
}

module.exports = { isLoggedIn, isAuthorized };
