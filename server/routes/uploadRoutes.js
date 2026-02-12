import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload, cloudinary } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Tek görsel yükle
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Görsel yüklenmedi'
            });
        }

        res.json({
            success: true,
            data: {
                url: req.file.path,
                publicId: req.file.filename
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Görsel yüklenirken hata oluştu',
            error: error.message
        });
    }
});

// @desc    Çoklu görsel yükle
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Görsel yüklenmedi'
            });
        }

        const images = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Görseller yüklenirken hata oluştu',
            error: error.message
        });
    }
});

// @desc    Görsel sil
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete('/:publicId', protect, async (req, res) => {
    try {
        await cloudinary.uploader.destroy(req.params.publicId);

        res.json({
            success: true,
            message: 'Görsel silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Görsel silinirken hata oluştu',
            error: error.message
        });
    }
});

export default router;
