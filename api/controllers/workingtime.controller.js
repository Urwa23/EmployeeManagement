import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createWorkingTimeRequest = async (req, res) => {
  try {
    const { requesterId, startTime, endTime, pause, comment, date } = req.body;
    console.log(req.body);

    // Step 1: Validate input data
    if (!requesterId || !startTime) {
      return res.status(400).json({ message: "'requesterId' and 'startTime' are required." });
    }

    if (!endTime) {
      return res.status(400).json({ message: "'endTime' is required." });
    }

    // Step 2: Check if startTime < endTime
    // if (startTime >= endTime) {
    //   return res.status(400).json({ message: "'Start Time' must be before 'End Time'." });
    // }

    // Step 3: Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Step 4: Create the working time request
    const workingTimeRequest = await prisma.workingTime.create({
      data: {
        requesterId,
        startTime,
        endTime,
        pause: pause || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status:"PENDING",
        date,
      },
    });

    // Step 5: Return the created working time request
    res.status(201).json(workingTimeRequest);

  } catch (error) {
    console.error('Error creating working time request:', error);
    res.status(500).json({ message: 'Error creating working time request.' });
  }
};

const getWorkingTimeRequests = async (req, res) => {
    try {
      const { userId } = req; // Assuming userId is set by the `verifyToken` middleware
  
      // Step 1: Fetch the working time requests for the logged-in user
      const workingTimeRequests = await prisma.workingTime.findMany({
        where: {
          requesterId: userId, // Filter by the logged-in user's ID
        },
        orderBy: {
          createdAt: 'desc', // Order by creation date, most recent first
        },
      });
  
      // Step 2: Return the working time requests
      res.status(200).json(workingTimeRequests);
    } catch (error) {
      console.error('Error fetching working time requests:', error);
      res.status(500).json({ message: 'Error fetching working time requests.' });
    }
  };

  const getWorkingTimeRequestsByManager = async (req, res) => {
    try {
      // Step 1: Retrieve the manager's ID from the authenticated user (set in `verifyToken`)
      const managerId = req.userId;
      console.log("Manager ID:", managerId);
  
      // Step 2: Find all subordinates of the manager
      const manager = await prisma.user.findUnique({
        where: { id: managerId },
        select: { subordinates: true }, // Fetch the subordinates array
      });
  
      if (!manager || !manager.subordinates.length) {
        return res.status(404).json({ message: "No subordinates found." });
      }
  
      const subordinateIds = manager.subordinates; // Extract the subordinate IDs
      console.log("Subordinate IDs:", subordinateIds);
  
      // Step 3: Fetch all working time requests for the subordinates
      const workingTimeRequests = await prisma.workingTime.findMany({
        where: {
          requesterId: { in: subordinateIds }, // Filter requests by subordinates' IDs
        },
        orderBy: { createdAt: 'desc' }, // Optionally order by most recent requests
        include: {
          requester: true, // Include details about the requester (optional)
        },
      });
  
      // Step 4: Return the fetched working time requests
      res.status(200).json(workingTimeRequests);
    } catch (error) {
      console.error("Error fetching working time requests:", error);
      res.status(500).json({ message: "Error fetching working time requests." });
    }
  };
  
  
  

export { createWorkingTimeRequest,getWorkingTimeRequests,getWorkingTimeRequestsByManager };
