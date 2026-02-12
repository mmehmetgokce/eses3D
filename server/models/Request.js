import mongoose from 'mongoose';

const requestItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    note: {
        type: String,
        default: ''
    }
});

const requestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: [true, 'Ad zorunludur'],
        trim: true
    },
    customerSurname: {
        type: String,
        required: [true, 'Soyad zorunludur'],
        trim: true
    },
    customerPhone: {
        type: String,
        required: [true, 'Telefon numarası zorunludur'],
        trim: true
    },
    items: [requestItemSchema],
    generalNote: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'completed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Benzersiz talep ID'si oluşturma
requestSchema.statics.generateRequestId = async function () {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Bu ay kaç talep var?
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const count = await this.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const sequence = String(count + 1).padStart(4, '0');

    return `TALEP-${year}${month}-${sequence}`;
};

const Request = mongoose.model('Request', requestSchema);

export default Request;
