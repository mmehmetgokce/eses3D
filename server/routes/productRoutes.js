import express from 'express';
import {
    getProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImages,
    deleteProductImage
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

// Image management (Admin)
router.post('/:id/images', protect, upload.array('images', 10), addProductImages);
router.delete('/:id/images/:imageId', protect, deleteProductImage);

export default router;
