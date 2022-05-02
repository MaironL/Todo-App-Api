const express = require('express');
const router = express.Router();
const { refreshAccessToken, logoutRefreshToken } = require('../controllers/renewalAuthN');

router.get('/', refreshAccessToken);
router.get('/logout', logoutRefreshToken);

module.exports = router;
