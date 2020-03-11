const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { isLoggedIn } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const db = require('./db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users/:id/messages', isLoggedIn, messageRoutes);
app.get('/api/messages', isLoggedIn, async (req, res, next) => {
  try {
    const FoundMessages = await db.MessageModel.find({})
      .sort({ createdAt: 'desc' })
      .populate('author', {
        username: true,
        profileImageUrl: true,
      });
    return res.status(200).json(FoundMessages);
  } catch (err) {
    return next(err);
  }
});

app.use(errorHandler.creatingErr);
app.use(errorHandler.sendErr);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
