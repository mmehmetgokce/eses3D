import Category from '../models/Category.js';

// @desc    Tüm kategorileri getir
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ order: 1, name: 1 });

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategoriler yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Tek kategori getir
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({
            slug: req.params.slug,
            isActive: true
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Yeni kategori ekle (Admin)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const { name, description, order } = req.body;

        const category = await Category.create({
            name,
            description,
            order
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Bu kategori adı zaten mevcut'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Kategori eklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Kategori güncelle (Admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori güncellenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Kategori sil (Admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Kategori silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kategori silinirken hata oluştu',
            error: error.message
        });
    }
};
