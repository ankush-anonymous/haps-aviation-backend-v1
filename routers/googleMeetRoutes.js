const express = require('express');
const router = express.Router();
const googleMeetController = require('../controllers/googleMeetController');

router.get('/auth/google', googleMeetController.authGoogle);
router.get('/oauth2callback', googleMeetController.handleOAuthCallback);
router.post('/createMeeting', googleMeetController.createMeeting);
// Add this to your googleMeetRoutes.js temporarily for debugging
router.get('/debug/oauth-config', (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    fullCallbackUrl: `${req.protocol}://${req.get('host')}/api/v1/google/oauth2callback`
  });
});


module.exports = router;
