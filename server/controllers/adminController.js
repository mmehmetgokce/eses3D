import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// JWT Token oluştur
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @desc    Admin girişi
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı adı ve şifre gereklidir'
            });
        }

        const admin = await Admin.findOne({ username }).select('+password');

        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz kullanıcı adı veya şifre'
            });
        }

        const token = generateToken(admin._id);

        res.json({
            success: true,
            data: {
                id: admin._id,
                username: admin.username,
                name: admin.name
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Giriş yapılırken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Admin bilgilerini getir
// @route   GET /api/admin/me
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);

        res.json({
            success: true,
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Profil yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    İlk admin oluştur (Kurulum için)
// @route   POST /api/admin/setup
// @access  Public (sadece admin yoksa)
export const setupAdmin = async (req, res) => {
    try {
        // Zaten admin var mı kontrol et
        const existingAdmin = await Admin.findOne();

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin zaten mevcut'
            });
        }

        const { username, password, name } = req.body;

        const admin = await Admin.create({
            username,
            password,
            name
        });

        const token = generateToken(admin._id);

        res.status(201).json({
            success: true,
            message: 'Admin hesabı oluşturuldu',
            data: {
                id: admin._id,
                username: admin.username,
                name: admin.name
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Admin oluşturulurken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Dashboard istatistikleri
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const Product = (await import('../models/Product.js')).default;
        const Category = (await import('../models/Category.js')).default;
        const Request = (await import('../models/Request.js')).default;

        const [productCount, categoryCount, requestCount, pendingRequests] = await Promise.all([
            Product.countDocuments({ isActive: true }),
            Category.countDocuments({ isActive: true }),
            Request.countDocuments(),
            Request.countDocuments({ status: 'pending' })
        ]);

        // Son 5 talep
        const recentRequests = await Request.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('requestId email status createdAt');

        res.json({
            success: true,
            data: {
                products: productCount,
                categories: categoryCount,
                totalRequests: requestCount,
                pendingRequests,
                recentRequests
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'İstatistikler yüklenirken hata oluştu',
            error: error.message
        });
    }
};
