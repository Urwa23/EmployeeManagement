import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {getSubordinateRequests} from '../controllers/user.controller.js'; // Import the function

const router = express.Router();

// Define the route to get subordinate absence and vacation requests
router.get('/api/getSubordinateRequests', getSubordinateRequests);

export default router;
