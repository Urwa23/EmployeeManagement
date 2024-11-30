import express from 'express';
import { googleCallback, logout, googleCallbackManager, getEmployeesWithoutManager } from '../controllers/auth.controller.js';  // Import your controller

const router = express.Router();

// Handle Google login callback
router.post('/auth/google/callback', googleCallback);

router.post('/auth/google/callbackManager', googleCallbackManager);
router.post('/auth/logout', logout);
// router.post('/auth/logout', getEmployeesWithoutManager);

export default router;

// made changes

