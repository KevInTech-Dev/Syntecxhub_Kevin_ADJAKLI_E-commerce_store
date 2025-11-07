import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getAllUsers, createAdmin, promoteToAdmin } from '../controllers/userController.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/', getAllUsers);
router.post('/admin', createAdmin);
router.put('/:id/promote', promoteToAdmin);

export default router;
