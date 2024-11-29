import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAbsenceRequest = async (req, res) => {
  try {
    // Step 1: Extract the data from the request body
    const { requesterId, reason, from, to, status, substitute } = req.body; // Corrected field name
    console.log(req.body);

    // Step 2: Validate the 'from' and 'to' dates
    if (!from || !to) {
      return res.status(400).json({ message: "'From' and 'To' dates are required." });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Ensure 'from' is earlier than 'to'
    if (fromDate >= toDate) {
      return res.status(400).json({ message: "'From' date should be earlier than 'To' date." });
    }

    // Step 3: Validate the 'reason'
    if (!reason) {
      return res.status(400).json({ message: "Reason for the absence is required." });
    }

    // Step 4: Check if the requester exists
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!requester) {
      return res.status(404).json({ message: "Requester not found." });
    }

    // Step 5: Create the absence request
    const absenceRequest = await prisma.absenceRequest.create({
      data: {
        requesterId, // The ID of the requester
        reason, // Reason for the absence
        from: fromDate, // Start date of the absence
        to: toDate, // End date of the absence
        status: status || 'PENDING', // Default status is 'PENDING' if not provided
        substitute, // Substitute's name
      },
    });

    // Step 6: Return the created absence request
    res.status(201).json(absenceRequest);
  } catch (error) {
    console.error("Error creating absence request:", error);
    res.status(500).json({ message: "Error creating absence request." });
  }
};

const getAbsenceRequests = async (req, res) => {
    try {
      // Step 1: Retrieve the requester's ID from the authenticated user (set in `verifyToken`)
      const requesterId = req.userId;
      console.log(requesterId)
  
      // Step 2: Fetch all absence requests for the requester
      const absenceRequests = await prisma.absenceRequest.findMany({
        where: { requesterId }, // Filter by the requester's ID
        orderBy: { createdAt: 'desc' }, // Optionally, order by most recent requests
      });
      console.log(absenceRequests)
  
      // Step 3: Return the fetched absence requests
      res.status(200).json(absenceRequests);
    } catch (error) {
      console.error("Error fetching absence requests:", error);
      res.status(500).json({ message: "Error fetching absence requests." });
    }
};

const changeAbsenceRequestStatus = async (req, res) => {
  const { id, status } = req.body; // id of the request and new status

  try {
    // Step 1: Get the logged-in manager's ID from the middleware (verifyToken should have set req.userId)
    const managerId = req.userId;

    // Step 2: Fetch the absence request by ID
    const absenceRequest = await prisma.absenceRequest.findUnique({
      where: { id },
      include: { requester: true }, // Get the requester info to check if this is a subordinate of the manager
    });

    if (!absenceRequest) {
      return res.status(404).json({ message: 'Absence request not found' });
    }

    // Step 3: Check if the current user is the manager of the requester
    if (absenceRequest.requester.managerId !== managerId) {
      return res.status(403).json({ message: 'You are not authorized to approve/reject this request' });
    }

    // Step 4: Validate the status (must be either 'APPROVED' or 'REJECTED')
    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return res.status(400).json({ message: 'Invalid status. Must be APPROVED or REJECTED.' });
    }

    // Step 5: Update the status of the absence request
    const updatedRequest = await prisma.absenceRequest.update({
      where: { id },
      data: { status },
    });

    // Step 6: Return the updated request
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating absence request:', error);
    res.status(500).json({ message: 'Error updating absence request' });
  }
};

export { createAbsenceRequest,getAbsenceRequests,changeAbsenceRequestStatus};
