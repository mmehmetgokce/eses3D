import express from 'express';
import {
    loginAdmin,
    getAdminProfile,
    setupAdmin,
    getDashboardStats
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

// Category, Product, Request için admin işlemleri ilgili router'larda

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/setup', setupAdmin);

// Protected routes
router.get('/me', protect, getAdminProfile);
router.get('/stats', protect, getDashboardStats);

export default router;
