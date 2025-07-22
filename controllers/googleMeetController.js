const { google } = require('googleapis');
const { saveGoogleTokens, getGoogleTokens } = require('../repositories/googleMeetRepository');
const {  getAuthUrl } = require('../service/googleClient');



let savedTokens = null; // For demo — replace with DB storage in production

// Step 1: Redirect to Google Auth
exports.authGoogle = (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
};

// Step 2: Handle OAuth callback

// exports.handleOAuthCallback = async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const userInfo = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });
//     const userEmail = userInfo.data.email;

//     // 🔐 Save to DB
//     await saveGoogleTokens(userEmail, tokens);

//     res.send('Authorization successful. You can now create Google Meet links.');
//   } catch (error) {
//     console.error('OAuth error:', error);
//     res.status(500).send('Authentication failed.');
//   }
// };

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.handleOAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("OAuth Code received:", code);

    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", tokens);

    oauth2Client.setCredentials(tokens);

    // Now fetch user info with access token
    const userInfoResponse = await google.oauth2('v2').userinfo.get({
      auth: oauth2Client,
    });

    const userEmail = userInfoResponse.data.email;
    console.log("User info:", userInfoResponse.data);

    await saveGoogleTokens(userEmail, tokens);

    res.send('Authorization successful. You can now create Google Meet links.');
  } catch (error) {
    console.error('OAuth error:', error?.response?.data || error);
    res.status(500).send('Authentication failed.');
  }
};



// Step 3: Create Google Meet link
exports.createMeeting = async (req, res) => {
  try {
    const { userEmail, startDateTime, endDateTime, summary, attendees } = req.body;

    const tokens = await getGoogleTokens(userEmail);
    if (!tokens) return res.status(401).json({ error: 'User not authenticated' });

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      scope: tokens.scope,
      token_type: tokens.token_type
    });

    // 🔄 Check for expiry
    if (Date.now() >= Number(tokens.expiry_date)) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      await saveGoogleTokens(userEmail, credentials); // update refreshed tokens
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description: 'Scheduled via MentorApp',
        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Kolkata',
        },
        attendees: attendees.map(email => ({ email })),
         sendUpdates: 'all',
        conferenceData: {
          createRequest: {
            requestId: `meet_${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetLink = response.data.hangoutLink;
    return res.status(200).json({ meetLink });
  } catch (error) {
    console.error('Failed to create meeting:', error);
    res.status(500).json({ error: 'Meeting creation failed' });
  }
};
