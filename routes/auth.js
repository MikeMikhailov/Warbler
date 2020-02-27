const express = require('express');
const { signUp } = require('../helpers/auth');

const router = express.Router();

router.post('/signup', signUp);

module.exports = router;
