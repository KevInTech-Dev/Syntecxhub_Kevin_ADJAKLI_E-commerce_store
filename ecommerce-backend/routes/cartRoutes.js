import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, asyncHandler(getCart));
router.post('/', protect, asyncHandler(addToCart));
router.put('/', protect, asyncHandler(updateCartItem));
router.delete('/', protect, asyncHandler(removeFromCart));
router.delete('/clear', protect, asyncHandler(clearCart));

export default router;
