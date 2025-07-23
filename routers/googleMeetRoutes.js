
// routes/auth.js
const express = require('express');
const router = express.Router();
const { googleAuth, googleAuthCallback } = require('../controllers/googleMeetController');



router.get('/auth', googleAuth);
router.get("/oauth2callback", googleAuthCallback);

module.exports = router;
