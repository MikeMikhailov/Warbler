const db = require('../db');

async function createMessage(req, res, next) {
  try {
    const CreatedMessage = await db.MessageModel.create({
      text: req.body.text,
      author: req.params.id,
    });
    const FoundUser = await db.UserModel.findById(req.params.id);
    FoundUser.messages.push(CreatedMessage.id);
    await FoundUser.save();
    const FoundMessage = await db.MessageModel.findById(CreatedMessage.id).populate('author', {
      username: true,
      profileImageUrl: true,
    });
    return res.status(200).json(FoundMessage);
  } catch (err) {
    return next(err);
  }
}

async function getMessage(req, res, next) {
  try {
    const FoundMessage = await db.MessageModel.findById(req.params.message_id);
    return res.status(200).json(FoundMessage);
  } catch (err) {
    return next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const FoundMessage = await db.MessageModel.findById(req.params.message_id);
    if (req.params.id === FoundMessage.author.toString()) {
      await FoundMessage.remove();
      return res.status(200).json(FoundMessage);
    }
    return next({
      status: 401,
      message: 'You are not authorized to do this',
    });
  } catch (err) {
    return next(err);
  }
}

const messagesHelpers = { createMessage, getMessage, deleteMessage };

module.exports = messagesHelpers;
