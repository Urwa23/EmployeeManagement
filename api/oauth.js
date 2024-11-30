import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// Function to get user data from Google API
async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = await response.json();
  console.log('User data:', data);
  return data;  // Return data if needed
}

// OAuth route for handling Google login callback
router.get('/', async (req, res, next) => {
  const code = req.query.code;
  console.log('OAuth code:', code);

  if (!code) {
    return res.status(400).json({ message: 'Missing authorization code' });
  }

  try {
    const redirectURL = process.env.REDIRECT_URI || "https://employeemanagement-2.onrender.com/auth/google/callback"; // Ensure this is correct
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);

    // Exchange code for tokens
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens); // Set credentials for the OAuth client

    console.info('Tokens acquired:', r.tokens);

    const user = oAuth2Client.credentials; // Tokens are here
    console.log('User credentials:', user);

    // Get user data using the access token
    const userData = await getUserData(user.access_token);

    // Optionally, store the user data in a cookie
    res.cookie('userData', userData, { httpOnly: true, secure: false, sameSite: 'None' });

    // Redirect after successful login
    res.redirect('https://employeemanagement-2.onrender.com/');

  } catch (err) {
    console.error('Error during OAuth authentication:', err);
    return res.status(500).json({ message: 'Authentication failed', error: err.message });
  }
});

export default router;
