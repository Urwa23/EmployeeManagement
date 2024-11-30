import express from 'express';
import {createWorkingTimeRequest, getWorkingTimeRequests, getWorkingTimeRequestsByManager} from '../controllers/workingtime.controller.js'; // Adjust path as needed
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();


router.post('/api/createWorkingTimeRequest', createWorkingTimeRequest);
router.get('/api/getWorkingTimeRequests',  getWorkingTimeRequests);
router.get('/api/getWorkingTimeRequestsByManager',  getWorkingTimeRequestsByManager);
// getWorkingTimeRequestsByManager

export default router;
