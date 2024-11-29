import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Google OAuth Client

// Create a transporter for Nodemailer to send email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,   // Your email address
    pass: process.env.GMAIL_PASS,   // Your email password or app-specific password
  },
});

const googleCallback = async (req, res) => {
  try {
    const { token } = req.body;  // Google token sent from frontend

    // Verify the Google token with Google API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Ensure your Google client ID is correct
    });

    const payload = ticket.getPayload();  // Get user info from the token
    const email = payload.email;
    const name = payload.name;

    // Check if the user already exists in the database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    // Generate JWT token for the authenticated user
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Ensure you have JWT_SECRET in your .env file
      { expiresIn: '1h' }
    );

    // Step 1: Send email notification to the user after successful login
    const mailOptions = {
      from: process.env.GMAIL_USER,   // Sender's email address
      to: email,                      // Recipient's email address (user's email)
      subject: 'Login Successful',
      text: `Hello ${name},\n\nYou have successfully logged into the application.\n\nBest regards,\nYour Team`, // Email body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // Step 2: Send the token and user info back to the frontend
    res.json({
      token: jwtToken,  // JWT token
      user,  // User data (optional, you can send more or less based on your need)
    });

  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(400).json({ message: 'Authentication failed' });
  }
};

// Logout function to clear the JWT token cookie
const logout = async (req, res) => {
  try {
    const { userId } = req.body;  // Destructure userId directly from req.body
    console.log(userId);  // Log userId to make sure it's coming in correctly

    // Step 1: Clear the JWT token cookie
    res.clearCookie('token');  // Clear the JWT token cookie

    // Step 2: Fetch the user's data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },  // Use the userId to find the user
      select: { email: true, name: true },   // Select email and name to send the logout confirmation email
    });
    console.log("here: ", user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user);  // Log user data to check if it's being retrieved

    // Step 3: Send the logout confirmation email
    const mailOptions = {
      from: process.env.GMAIL_USER,  // Sender's email address
      to: user.email,                // Recipient's email address (the logged-out user's email)
      subject: 'Logout Confirmation',
      text: `Hello ${user.name},\n\nYou have successfully logged out of the application.\n\nThank you!`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Step 4: Return the response to the client
    res.status(200).json({ message: 'Logged out successfully and email sent' });
  } catch (error) {
    console.error('Error during logout process:', error);
    res.status(500).json({ message: 'Error logging out or sending email' });
  }
};




const googleCallbackManager = async (req, res) => {
  try {
    const { token } = req.body;  // Google token sent from frontend

    // Verify the Google token with Google API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Ensure your Google client ID is correct
    });

    const payload = ticket.getPayload();  // Get user info from the token
    const email = payload.email;
    const name = payload.name;

    // Check if the user already exists in the database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If the user doesn't exist, create a new one with role 'MANAGER'
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: 'MANAGER', // Assign the role of MANAGER
        },
      });
    } else {
      // If the user exists and is not already a manager, return an error
      if (user.role !== 'MANAGER') {
        return res.status(400).json({
          message: 'Please sign in as a user, you are not a manager.',
        });
      } else {
        // If the user exists and is a manager, proceed to step 2
        user = await prisma.user.update({
          where: { email },
          data: { role: 'MANAGER' },  // Ensure the role is set as 'MANAGER'
        });
      }
    }

    // Step 2: Update all users with the role "USER" to have this manager as their manager
    await prisma.user.updateMany({
      where: { role: 'USER' },  // Filter all users with the role 'USER'
      data: {
        managerId: user.id,  // Set the current manager's ID as managerId
      },
    });

    // Step 3: Add all users with role 'USER' to the manager's subordinates
    const usersToAssign = await prisma.user.findMany({
      where: { role: 'USER' },  // Find all users with role 'USER'
      select: { id: true },     // Only select the 'id' field
    });

    // Get the user IDs from usersToAssign
    const subordinateIds = usersToAssign.map((user) => user.id);

    console.log("Subordinate IDs: ", subordinateIds);

    // Update the manager's subordinates by pushing the user IDs
    await prisma.user.update({
      where: { id: user.id }, // Manager's ID
      data: {
        subordinates: {
          push: subordinateIds, // Add the array of IDs to subordinates
        },
      },
    });

    console.log("Subordinates connected successfully.");

    // Step 4: Generate JWT Token for the manager
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Ensure you have JWT_SECRET in your .env file
      { expiresIn: '1h' }  // Set token expiration (1 hour in this case)
    );

    // Send the token and user info back to the frontend
    res.json({
      token: jwtToken,  // JWT token
      user,  // User data (optional, you can send more or less based on your need)
    });

  } catch (error) {
    console.error('Error during Google authentication for manager:', error);
    res.status(500).json({ message: 'Error during manager sign-in and assignment' });
  }
};


const getEmployeesWithoutManager = async (req, res) => {
  try {
    // Fetch all users who are employees (role 'USER') and do not have a managerId
    const employeesWithoutManager = await prisma.user.findMany({
      where: {
        role: 'USER',            // Role is 'USER'
        managerId: null,         // Manager ID is not set (i.e., the user is not a manager)
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        managerId: true,        // Just for debugging or confirmation, if needed
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return the list of employees who are not managers
    res.status(200).json(employeesWithoutManager);
  } catch (error) {
    console.error('Error fetching employees without manager:', error);
    res.status(500).json({ message: 'Error fetching employees without manager' });
  }
};

export { logout, googleCallbackManager, googleCallback, getEmployeesWithoutManager };
