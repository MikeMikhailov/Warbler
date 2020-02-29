const jwt = require('jsonwebtoken');
const db = require('../db');

async function signIn(req, res, next) {
  try {
    const User = await db.User.findOne({
      email: req.body.email,
    });
    if (!User) {
      throw new Error("A user with given email doesn't exist");
    }
    const { username, _id: id, profileImageUrl } = User;
    const isMatch = await User.comparePassword(req.body.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          id,
          username,
          profileImageUrl,
        },
        process.env.SECRET_KEY,
      );
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token,
      });
    }
    throw new Error('Invalid password!');
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
}

async function signUp(req, res, next) {
  try {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const isValidEmail = emailRegex.test(req.body.email);
    if (isValidEmail) {
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
    }
    throw new Error('The email you entered is not a valid email!');
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Sorry, that username and/or email is taken!';
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
}

const authHelpers = { signUp, signIn };

module.exports = authHelpers;
