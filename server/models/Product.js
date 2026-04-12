import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ürün adı zorunludur'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    images: [{
        url: String,
        publicId: String
    }],
    standardSize: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: null,
        min: 0
    },
    colorCount: {
        type: Number,
        default: 0,
        min: 0,
        max: 4
    },
    colorSlots: [{
        label: { type: String, default: '' },
        allowedColors: [String]
    }],
    wholesaleEnabled: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Kategoriler ile birlikte populate için virtual
productSchema.virtual('categoryDetails', {
    ref: 'Category',
    localField: 'categories',
    foreignField: '_id'
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
