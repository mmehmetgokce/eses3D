import express from 'express';
import {
    createRequest,
    getRequestByRequestId,
    getAllRequests,
    updateRequestStatus,
    deleteRequest
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createRequest);
router.get('/:requestId', getRequestByRequestId);

// Admin routes
router.get('/', protect, getAllRequests);
router.put('/:id/status', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);

export default router;
