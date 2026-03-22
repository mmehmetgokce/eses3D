import Request from '../models/Request.js';
import { sendNewRequestNotification } from '../services/emailService.js';

// @desc    Yeni talep oluştur
// @route   POST /api/requests
// @access  Public
export const createRequest = async (req, res) => {
    try {
        const { customerName, customerSurname, customerPhone, items, generalNote } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'En az bir ürün seçmelisiniz'
            });
        }

        if (!customerName || !customerSurname || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: 'Ad, soyad ve telefon numarası zorunludur'
            });
        }

        // Benzersiz talep ID'si oluştur
        const requestId = await Request.generateRequestId();

        const request = await Request.create({
            requestId,
            customerName,
            customerSurname,
            customerPhone,
            items,
            generalNote
        });

        res.status(201).json({
            success: true,
            data: {
                requestId: request.requestId,
                itemCount: request.items.length
            },
            message: 'Talebiniz başarıyla oluşturuldu!'
        });

        // E-posta bildirimini arka planda gönder (Resend API)
        sendNewRequestNotification(request)
            .then(() => console.log(`[EMAIL] Gönderildi: ${requestId}`))
            .catch(err => console.error(`[EMAIL] HATA (${requestId}):`, err.message));
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Talep oluşturulurken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Talep detayı getir (ID ile)
// @route   GET /api/requests/:requestId
// @access  Public (sadece kendi talebini görebilir)
export const getRequestByRequestId = async (req, res) => {
    try {
        const request = await Request.findOne({
            requestId: req.params.requestId
        }).populate('items.product', 'name images');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Talep bulunamadı'
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Talep yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Tüm talepleri getir (Admin)
// @route   GET /api/requests
// @access  Private/Admin
export const getAllRequests = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const requests = await Request.find(query)
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Request.countDocuments(query);

        res.json({
            success: true,
            count: requests.length,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Talepler yüklenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Talep durumunu güncelle (Admin)
// @route   PUT /api/requests/:id/status
// @access  Private/Admin
export const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const request = await Request.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Talep bulunamadı'
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Talep güncellenirken hata oluştu',
            error: error.message
        });
    }
};

// @desc    Talep sil (Admin)
// @route   DELETE /api/requests/:id
// @access  Private/Admin
export const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Talep bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Talep silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Talep silinirken hata oluştu',
            error: error.message
        });
    }
};
