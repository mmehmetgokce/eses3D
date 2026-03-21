import express from 'express';
import {
    createRequest,
    getRequestByRequestId,
    getAllRequests,
    updateRequestStatus,
    deleteRequest
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';
import { sendNewRequestNotification } from '../services/emailService.js';

const router = express.Router();

// Geçici e-posta test endpoint'i (DEBUG - sonra kaldırılacak)
router.get('/test-email', async (req, res) => {
    try {
        // Env kontrol
        const envCheck = {
            EMAIL_USER: process.env.EMAIL_USER ? 'SET (' + process.env.EMAIL_USER + ')' : 'MISSING',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'SET (length: ' + process.env.EMAIL_PASS.length + ')' : 'MISSING',
            NOTIFICATION_EMAILS: process.env.NOTIFICATION_EMAILS || 'MISSING'
        };

        // Test e-postası gönder
        const fakeRequest = {
            requestId: 'TEST-DEBUG-001',
            customerName: 'Test',
            customerSurname: 'Debug',
            customerPhone: '905551234567',
            items: [{ productName: 'Debug Test Ürünü', quantity: 1, selectedColors: [], unitPrice: null }],
            generalNote: 'Bu bir debug test e-postasıdır.'
        };

        await sendNewRequestNotification(fakeRequest);

        res.json({
            success: true,
            message: 'E-posta başarıyla gönderildi!',
            envCheck
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            envCheck: {
                EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'MISSING',
                EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING',
                NOTIFICATION_EMAILS: process.env.NOTIFICATION_EMAILS || 'MISSING'
            }
        });
    }
});

// Public routes
router.post('/', createRequest);
router.get('/:requestId', getRequestByRequestId);

// Admin routes
router.get('/', protect, getAllRequests);
router.put('/:id/status', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);

export default router;
