var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const { OAuth2Client } = require('google-auth-library');

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = await response.json();
  console.log('User data:', data);

  // changes
  return data;  // Return data if needed
}

/* GT home page. */
router.get('/', async function(req, res, next) {
  const code = req.query.code;
  console.log('OAuth code:', code);

  try {
    const redirectURL = "http://localhost:5000/auth/google/callback";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );
    const r = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(r.tokens);
    console.info('Tokens acquired.');
    const user = oAuth2Client.credentials;
    console.log('User credentials:', user);

    // Retrieve user data using access token
    const userData = await getUserData(oAuth2Client.credentials.access_token);

    // Optionally, send the data back to the frontend
    res.cookie('userData', userData, { httpOnly: true, secure: false, sameSite: 'None' });  // Example of storing user data in a cookie

  } catch (err) {
    console.error('Error during OAuth authentication:', err);
    return res.status(500).json({ message: 'Authentication failed', error: err.message });
  }

  // Redirect to frontend after authentication
  res.redirect(303, 'http://localhost:3000/');
});

module.exports = router;
