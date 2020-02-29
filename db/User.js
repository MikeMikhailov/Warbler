const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'You need to enter an email!',
    unique: 'This email has already been used',
  },
  username: {
    type: String,
    required: 'You need to enter a username',
    unique: 'This username has already been used',
  },
  password: {
    type: String,
    required: 'You need to enter a password',
  },
  profileImageUrl: {
    type: String,
  },
});

UserSchema.pre('save', async function hashPassword(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword, next) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

const User = mongoose.model('user', UserSchema);

module.exports = User;
