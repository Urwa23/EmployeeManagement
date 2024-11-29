import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,   // Your email address
    pass: process.env.GMAIL_PASS,   // Your email password or app-specific password
  },
});

const createVacationRequest = async (req, res) => {
  try {
    // Step 1: Extract the data from the request body
    const { requesterId, from, to, status, comments } = req.body;

    // Step 2: Validate the 'from' and 'to' dates
    if (!from || !to) {
      return res.status(400).json({ message: "'from' and 'to' dates are required." });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Ensure 'from' is earlier than 'to'
    if (fromDate >= toDate) {
      return res.status(400).json({ message: "'From' date should be earlier than 'To' date." });
    }

    // Step 3: Check if the requester exists
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!requester) {
      return res.status(404).json({ message: "Requester not found." });
    }

    // Step 4: Create the vacation request
    const vacationRequest = await prisma.vacationRequest.create({
      data: {
        requesterId,
        status: status || 'PENDING',  // Default to 'PENDING' if not provided
        from: fromDate,
        to: toDate,
        comments,
      },
    });

    // Step 5: Fetch the manager's email
    const manager = await prisma.user.findUnique({
      where: { id: requester.managerId },  // Find the manager by managerId
      select: { email: true, name: true },
    });

    // Step 6: Send email notifications to both requester and manager if the request is approved
    // if (vacationRequest.status === 'APPROVED' && manager) {
      // Send email to requester and manager
      const mailOptionsToRequester = {
        from: process.env.GMAIL_USER,
        to: requester.email,  // Send to requester's email
        subject: 'Vacation Request Submitted',
        text: `Hello ${requester.name},\n\nYour have created a new vacation request From: ${fromDate.toDateString()} To: ${toDate.toDateString()}\n\nBest regards,\nYour Team`,
      };

      const mailOptionsToManager = {
        from: process.env.GMAIL_USER,
        to: manager.email,  // Send to manager's email
        subject: 'Vacation Request Received',
        text: `Hello ${manager.name},\n\n Employee ${requester.name} has requested for vacations From: ${fromDate.toDateString()} To: ${toDate.toDateString()}\n\nBest regards,\nYour Team`,
      };

      // Send the emails
      await transporter.sendMail(mailOptionsToRequester);
      await transporter.sendMail(mailOptionsToManager);
    // }

    // Step 7: Return the created vacation request
    res.status(201).json(vacationRequest);

  } catch (error) {
    console.error("Error creating vacation request:", error);
    res.status(500).json({ message: "Error creating vacation request." });
  }
};


const getVacationRequests = async (req, res) => {
  try {
    
    const requesterId = req.userId;
    console.log("requesterID: ",requesterId)

   
    const vacationRequests = await prisma.vacationRequest.findMany({
      where: { requesterId }, 
      orderBy: { createdAt: 'desc' }, 
    });

   
    res.status(200).json(vacationRequests);
  } catch (error) {
    console.error("Error fetching vacation requests:", error);
    res.status(500).json({ message: "Error fetching vacation requests." });
  }
};


const updateVacationRequestStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // Get request ID and new status from the request body

    if (!id || !status) {
      return res.status(400).json({ message: "Request ID and status are required." });
    }

    // Step 1: Find the vacation request by ID
    const vacationRequest = await prisma.vacationRequest.findUnique({
      where: { id: id },
      include: {
        requester: true, // Include the requester (the user who made the request)
      },
    });

    if (!vacationRequest) {
      return res.status(404).json({ message: "Vacation request not found." });
    }

    // Step 2: Check if the current user is the manager of the requester
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId }, // Assuming userId is set by the `verifyToken` middleware
    });

    if (!currentUser || currentUser.id !== vacationRequest.requester.managerId) {
      return res.status(403).json({ message: "You are not authorized to approve or reject this request." });
    }

    // Step 3: Update the vacation request's status
    const updatedVacationRequest = await prisma.vacationRequest.update({
      where: { id: id },
      data: { status: status }, // Update the status to 'APPROVED' or 'REJECTED'
    });

    // Step 4: Send email notifications to both the requester and the manager
    const requester = vacationRequest.requester;
    const manager = currentUser;

    const mailOptionsToRequester = {
      from: process.env.GMAIL_USER,
      to: requester.email,  // Send to requester's email
      subject: `Vacation Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      text: `Hello ${requester.name},\n\nYour vacation request from ${vacationRequest.from.toDateString()} to ${vacationRequest.to.toDateString()} has been ${status.toLowerCase()} by your manager, ${manager.name}.\n\nBest regards,\nYour Team`,
    };

    const mailOptionsToManager = {
      from: process.env.GMAIL_USER,
      to: manager.email,  // Send to manager's email
      subject: `You have ${status === 'APPROVED' ? 'approved' : 'rejected'} a vacation request`,
      text: `Hello ${manager.name},\n\nYou have ${status.toLowerCase()} the vacation request from ${requester.name} for the dates ${vacationRequest.from.toDateString()} to ${vacationRequest.to.toDateString()}.\n\nBest regards,\nYour Team`,
    };

    // Send the emails
    await transporter.sendMail(mailOptionsToRequester);
    await transporter.sendMail(mailOptionsToManager);

    // Step 5: Return the updated vacation request
    res.status(200).json(updatedVacationRequest);

  } catch (error) {
    console.error('Error updating vacation request status:', error);
    res.status(500).json({ message: 'Error updating vacation request status.' });
  }
};

export { createVacationRequest,getVacationRequests,updateVacationRequestStatus};
