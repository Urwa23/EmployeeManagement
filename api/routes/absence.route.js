import express from 'express';
import {changeAbsenceRequestStatus, createAbsenceRequest,getAbsenceRequests} from '../controllers/absence.controller.js'; // Adjust path as needed
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/api/requestAbsence', verifyToken, createAbsenceRequest);
router.get('/api/getAbsencesRequests', verifyToken, getAbsenceRequests);
router.post('/api/changeAbsenceRequestStatus', verifyToken, changeAbsenceRequestStatus);

export default router;
