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

  const flow = req.query.flow || 'login'; // default to login if not provided

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: flow, // ⬅️ capture flow and send as state
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
  const flow = req.query.state || 'login';

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfoResponse = await oauth2.userinfo.get();

    const email = userInfoResponse.data.email;
    const name = userInfoResponse.data.name;
    const picture = userInfoResponse.data.picture;

    // Extract token info
    const tokenData = {
      mentor_email: email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
    };

    // Try to update existing token, if not found, save new
    const existing = await googleTokenRepository.getTokenByEmail(email);
    if (existing) {
      await googleTokenRepository.updateToken(tokenData);
    } else {
      await googleTokenRepository.saveToken(tokenData);
    }

    // Redirect based on flow
    if (flow === 'signup') {
      res.redirect(`${process.env.FRONTEND_URL}/onboard/mentor?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&picture=${encodeURIComponent(picture)}&flow=${flow}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/mentor/login?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&picture=${encodeURIComponent(picture)}&flow=${flow}`);
    }

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Authentication failed.');
  }
};




module.exports = {
    googleAuth,
    googleAuthCallback,
};
