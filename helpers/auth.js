const jwt = require('jsonwebtoken');
const db = require('../db');

const { SECRET_KEY } = process.env;

async function signIn(req, res, next) {
  try {
    const User = await db.UserModel.findOne({
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
        SECRET_KEY,
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
    const user = await db.UserModel.create(req.body);
    const { id, username, profileImageUrl } = user;
    const token = jwt.sign(
      {
        id,
        username,
        profileImageUrl,
      },
      SECRET_KEY,
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token,
    });
  } catch (err) {
    //  * Giving unique validator a custom message
    if (err.code === 11000) {
      err.message = 'Sorry, that username and/or email is taken!';
    } else if (err.message.indexOf('#') !== -1) {
      //  * Displaying multiple validation errors by using # as separator
      const indices = [];
      for (let i = 0; i < err.message.length; i += 1) {
        if (err.message[i] === '#') {
          indices.push(i);
        }
      }
      let errorMessage = '';
      for (let j = 1; j < indices.length; j += 2) {
        errorMessage += `${err.message.substring(indices[j - 1] + 1, indices[j])}\n`;
      }
      err.message = errorMessage.slice(0, -1);
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
}

const authHelpers = { signUp, signIn };

module.exports = authHelpers;
