import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getSubordinateRequests = async (req, res) => {
  try {
    // Access userId directly from req.userId (which should be set by the verifyToken middleware)
    const userId = req.userId;
    console.log("requester ID from getsub: ", userId); // Check if userId is available

    // Step 1: Get the current user's subordinates
    const user = await prisma.user.findUnique({
      where: { id: userId }, // Use userId directly
      select: {
        subordinates: true, // Get the subordinates array
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const subordinateIds = user.subordinates; // List of subordinate user IDs

    if (subordinateIds.length === 0) {
      return res.status(404).json({ message: "No subordinates found." });
    }

    // Step 2: Fetch only "PENDING" absence and vacation requests for the subordinates
    const [absenceRequests, vacationRequests] = await Promise.all([
      prisma.absenceRequest.findMany({
        where: {
          requesterId: { in: subordinateIds }, // Fetch absence requests for subordinates
          status: 'PENDING',  // Filter by PENDING status
        },
        include: {
          requester: true, // Include requester info (optional)
        },
      }),
      prisma.vacationRequest.findMany({
        where: {
          requesterId: { in: subordinateIds }, // Fetch vacation requests for subordinates
          status: 'PENDING',  // Filter by PENDING status
        },
        include: {
          requester: true, // Include requester info (optional)
        },
      }),
    ]);

    // Step 3: Return the fetched requests
    res.status(200).json({
      absenceRequests,
      vacationRequests,
    });

  } catch (error) {
    console.error('Error fetching subordinate requests:', error);
    res.status(500).json({ message: 'Error fetching subordinate requests' });
  }
};

export { getSubordinateRequests };
