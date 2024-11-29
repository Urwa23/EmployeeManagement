import express from 'express';
import {createWorkingTimeRequest, getWorkingTimeRequests, getWorkingTimeRequestsByManager} from '../controllers/workingtime.controller.js'; // Adjust path as needed
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();


router.post('/api/createWorkingTimeRequest', verifyToken, createWorkingTimeRequest);
router.get('/api/getWorkingTimeRequests', verifyToken, getWorkingTimeRequests);
router.get('/api/getWorkingTimeRequestsByManager', verifyToken, getWorkingTimeRequestsByManager);
// getWorkingTimeRequestsByManager

export default router;
