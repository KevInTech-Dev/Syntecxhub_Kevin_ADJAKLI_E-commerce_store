import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/create-checkout-session', protect, asyncHandler(createCheckoutSession));

export default router;
