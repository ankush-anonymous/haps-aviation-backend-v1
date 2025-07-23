const { google } = require('googleapis'); // Google API client library
const googleTokenRepository = require('../repositories/googleMeetRepository'); // Our database repository
require('dotenv').config();


// Initialize Google OAuth2 client with credentials from environment variables.
// These credentials should be obtained from your Google Cloud Project.
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

/**
 * Initiates the Google OAuth authentication process.
 * Redirects the user to Google's consent screen to grant permissions.
 */
// Step 1: Redirect user to Google's consent screen
const googleAuth = (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',  
  });

  res.redirect(authorizationUrl);
};

/**
 * Handles the callback from Google after the user grants/denies permissions.
 * Exchanges the authorization code for access and refresh tokens,
 * fetches user profile, and saves/updates tokens in the database.
 */
const googleAuthCallback = async (req, res) => {
  const code = req.query.code;

  try {
    // Get access token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfoResponse = await oauth2.userinfo.get();

    const email = userInfoResponse.data.email;
    const name = userInfoResponse.data.name;
    const picture = userInfoResponse.data.picture;

    // Redirect to frontend with email (and other optional info)
    res.redirect(`${process.env.FRONTEND_URL}/onboard/mentor?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&picture=${encodeURIComponent(picture)}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Authentication failed.');
  }
};

module.exports = {
    googleAuth,
    googleAuthCallback,
};
