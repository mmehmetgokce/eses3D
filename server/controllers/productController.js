import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Tüm ürünleri getir
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, search, wholesale } = req.query;

        let query = { isActive: true };

        if (wholesale === 'true') {
            query.wholesaleEnabled = true;
        }

        if (category) {
            query.categories = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query)
            .populate('categories', 'name slug')
            .sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürünler yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Tek ürün getir
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('categories', 'name slug');

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürün yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Kategoriye göre ürünler getir
// @route   GET /api/products/category/:slug
// @access  Public
export const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .populate({
                path: 'categories',
                match: { slug: req.params.slug, isActive: true }
            })
            .sort({ order: 1, createdAt: -1 });

        // categories dizi içindeki eşleşenleri filtrele
        const filteredProducts = products.filter(p => p.categories && p.categories.length > 0);

        res.json({
            success: true,
            count: filteredProducts.length,
            data: filteredProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürünler yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Yeni ürün ekle (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, description, categories, standardSize, order, price, colorCount, colorSlots } = req.body;

        const product = await Product.create({
            name,
            description,
            categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
            standardSize,
            order,
            price,
            colorCount,
            colorSlots,
            images: []
        });

        await product.populate('categories', 'name slug');

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürün eklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Ürün güncelle (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('categories', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürün güncellenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Ürün sil (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        // Cloudinary'den görselleri sil
        for (const image of product.images) {
            if (image.publicId) {
                await cloudinary.uploader.destroy(image.publicId);
            }
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Ürün silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ürün silinirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Ürüne görsel ekle (Admin)
// @route   POST /api/products/:id/images
// @access  Private/Admin
export const addProductImages = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Yüklenecek görsel bulunamadı'
            });
        }

        const newImages = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        product.images.push(...newImages);
        await product.save();

        await product.populate('category', 'name slug');

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Görsel yükleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Görsel eklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Ürün görseli sil (Admin)
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
export const deleteProductImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        const imageIndex = product.images.findIndex(
            img => img._id.toString() === req.params.imageId
        );

        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Görsel bulunamadı'
            });
        }

        const image = product.images[imageIndex];

        // Cloudinary'den sil
        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        product.images.splice(imageIndex, 1);
        await product.save();

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Görsel silinirken hata oluştu',
            error: error.message
        });
    }
};
