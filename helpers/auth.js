const jwt = require('jsonwebtoken');
const db = require('../db');

exports.signIn = function signIn() {};

exports.signUp = async function signUp(req, res, next) {
  try {
    const user = await db.User.create(req.body);
    const { _id, username, profileImageUrl } = user;
    const token = jwt.sign(
      {
        id: _id,
        username,
        profileImageUrl,
      },
      process.env.SECRET_KEY,
    );
    return res.status(200).json({
      id: _id,
      username,
      profileImageUrl,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Sorry, that username and/or email is taken!';
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};
