// This is the file that handles Google OAuth callback (likely in your routes or auth controller)
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

  // If there's no code (bypassing actual OAuth), simulate a logged-in user
  if (!code) {
    // Mock user data to simulate authentication
    const mockUserData = {
      id: "mockUserId",
      name: "Mock User",
      email: "mockuser@example.com",
      picture: "https://example.com/mockuser.jpg"
    };

    // Optionally, you can simulate the token as well
    const mockToken = "mockAccessToken";

    // Set mock user data into a cookie to simulate a logged-in state
    res.cookie('userData', mockUserData, {
      httpOnly: true,
      secure: false,  // Set to true for production
      sameSite: 'Strict',
      maxAge: 3600000  // 1 hour
    });

    // Set mock token in the cookie (this could be a simulated access token)
    res.cookie('token', mockToken, {
      httpOnly: true,
      secure: false,  // Set to true for production
      sameSite: 'Strict',
      maxAge: 3600000
    });

    // Redirect to the main page (show the website as if the user is logged in)
    return res.redirect('https://employeemanagement-2.onrender.com/');
  }

  try {
    const redirectURL = process.env.REDIRECT_URI || "https://employeemanagement-2.onrender.com/auth/google/callback";
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);

    // Exchange code for tokens (this will be skipped in demo)
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens); // Set credentials for the OAuth client

    const user = oAuth2Client.credentials; // Tokens are here

    // Get user data using the access token
    const userData = await getUserData(user.access_token);

    // Store the actual user data in cookies for normal login flow
    res.cookie('userData', userData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000
    });

    res.cookie('token', user.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000
    });

    // Redirect after successful login
    res.redirect('https://employeemanagement-2.onrender.com/');

  } catch (err) {
    console.error('Error during OAuth authentication:', err);
    return res.status(500).json({ message: 'Authentication failed', error: err.message });
  }
});

export default router;
