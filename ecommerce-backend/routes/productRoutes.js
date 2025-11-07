import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import multer from 'multer';

// Configure multer for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${unique}.${ext}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProductById));
router.post('/', protect, adminOnly, asyncHandler(createProduct));
router.post('/upload', protect, adminOnly, upload.single('image'), asyncHandler(uploadProductImage));
router.put('/:id', protect, adminOnly, asyncHandler(updateProduct));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteProduct));

export default router;
