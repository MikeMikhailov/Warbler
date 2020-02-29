const mongoose = require('mongoose');
const UserModel = require('./User');

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: "Message can't be empty!",
      maxlength: 280,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

messageSchema.pre('remove', async function removeReferenceFromUser(next) {
  try {
    const User = await UserModel.findById(this.author);
    User.messages.remove(this.id);
    await User.save();
    return next();
  } catch (err) {
    return next(err);
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
