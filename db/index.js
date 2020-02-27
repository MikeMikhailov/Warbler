const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/warbler', {
  keepAlive: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports.User = require('./User');
