import express from 'express';
import { verifyToken } from "../middleware/verifyToken.js";
import {createVacationRequest,getVacationRequests, updateVacationRequestStatus} from '../controllers/vacation.controller.js';

// import { googleCallback, logout } from '../controllers/auth.controller.js';  // Import your controller

const router = express.Router();

router.post("/api/requestVacation",  createVacationRequest);
router.get("/api/getVacationRequests",  getVacationRequests);
router.post("/api/changeVacationRequestStatus",  updateVacationRequestStatus);


export default router;

