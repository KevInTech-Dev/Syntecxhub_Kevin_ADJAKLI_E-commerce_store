import express from 'express';
import { register, login } from '../controllers/authController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import validateRequest from '../utils/validateRequest.js';
import authLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validateRequest, asyncHandler(register));
router.post('/login', authLimiter, loginValidator, validateRequest, asyncHandler(login));

export default router;
