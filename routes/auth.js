const express = require('express');
const { signUp, signIn } = require('../helpers/auth');

const router = express.Router();

// URL Prefix: /api/auth
router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;
