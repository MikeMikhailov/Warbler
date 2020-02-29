require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.use(errorHandler.creatingErr);

app.use(errorHandler.sendErr);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
