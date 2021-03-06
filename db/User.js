const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: '#You need to enter an email#',
    unique: true,
    match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, '#The email you entered is not a valid email#'],
  },
  username: {
    type: String,
    required: '#You need to enter a username#',
    unique: true,
  },
  password: {
    type: String,
    required: [true, '#You need to enter a password#'],
    minlength: [8, '#The password should be at least 8 characters#'],
  },
  profileImageUrl: {
    type: String,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

userSchema.pre('save', async function hashPassword(next) {
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

userSchema.methods.comparePassword = async function comparePassword(candidatePassword, next) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
