import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ürün adı zorunludur'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Ürün açıklaması zorunludur']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Kategori zorunludur']
    },
    images: [{
        url: String,
        publicId: String
    }],
    standardSize: {
        type: String,
        default: ''
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

// Kategori ile birlikte populate için virtual
productSchema.virtual('categoryDetails', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id',
    justOne: true
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
