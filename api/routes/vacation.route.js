import express from 'express';
import { verifyToken } from "../middleware/verifyToken.js";
import {createVacationRequest,getVacationRequests, updateVacationRequestStatus} from '../controllers/vacation.controller.js';

// import { googleCallback, logout } from '../controllers/auth.controller.js';  // Import your controller

const router = express.Router();

router.post("/api/requestVacation", verifyToken, createVacationRequest);
router.get("/api/getVacationRequests", verifyToken, getVacationRequests);
router.post("/api/changeVacationRequestStatus", verifyToken, updateVacationRequestStatus);


export default router;

