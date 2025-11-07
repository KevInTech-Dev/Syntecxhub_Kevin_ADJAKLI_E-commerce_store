import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markAsPaid,
  markAsDelivered,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, asyncHandler(createOrder));
router.get('/mine', protect, asyncHandler(getMyOrders));
router.get('/:id', protect, asyncHandler(getOrderById));
router.get('/', protect, adminOnly, asyncHandler(getAllOrders));
router.put('/:id/pay', protect, asyncHandler(markAsPaid));
router.put('/:id/deliver', protect, adminOnly, asyncHandler(markAsDelivered));

export default router;
