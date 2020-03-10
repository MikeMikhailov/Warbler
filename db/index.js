const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_DB_URL, {
  keepAlive: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports.UserModel = require('./User');
module.exports.MessageModel = require('./Message');
