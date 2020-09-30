const express = require('express');
const { createMessage, getMessage, deleteMessage } = require('../helpers/messages');
const { isAuthorized } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// URL Prefix: /api/users/:id/messages
router.post('/', isAuthorized, createMessage);

router.route('/:message_id').delete(isAuthorized, deleteMessage).get(getMessage);

module.exports = router;
