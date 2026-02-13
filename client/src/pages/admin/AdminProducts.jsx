import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import {
    getProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImages,
    deleteProductImage
} from '../../services/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        standardSize: '',
        price: '',
        order: 0
    });
    const [saving, setSaving] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getProducts(),
                getCategories()
            ]);
            setProducts(productsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            console.error('Veri yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                category: product.category?._id || '',
                standardSize: product.standardSize || '',
                price: product.price != null ? product.price : '',
                order: product.order || 0
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                category: categories[0]?._id || '',
                standardSize: '',
                price: '',
                order: 0
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
            toast.error('Ad, açıklama ve kategori gereklidir!');
            return;
        }

        try {
            setSaving(true);
            if (editingProduct) {
                const submitData = {
                    ...formData,
                    price: formData.price !== '' ? Number(formData.price) : null
                };
                await updateProduct(editingProduct._id, submitData);
                toast.success('Ürün güncellendi!');
            } else {
                const submitData = {
                    ...formData,
                    price: formData.price !== '' ? Number(formData.price) : null
                };
                await createProduct(submitData);
                toast.success('Ürün eklendi!');
            }
            closeModal();
            fetchData();
        } catch (error) {
            const message = error.response?.data?.message || 'İşlem sırasında hata oluştu';
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        if (!confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            await deleteProduct(product._id);
            toast.success('Ürün silindi!');
            fetchData();
        } catch (error) {
            toast.error('Ürün silinirken hata oluştu');
        }
    };

    const handleImageUpload = async (e) => {
        if (!editingProduct) return;

        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formDataUpload = new FormData();
        for (let i = 0; i < files.length; i++) {
            formDataUpload.append('images', files[i]);
        }

        try {
            setUploadingImages(true);
            await addProductImages(editingProduct._id, formDataUpload);
            toast.success('Görseller yüklendi!');

            // Ürünü yeniden yükle
            const response = await getProducts();
            setProducts(response.data.data);
            const updated = response.data.data.find(p => p._id === editingProduct._id);
            if (updated) setEditingProduct(updated);
        } catch (error) {
            toast.error('Görsel yüklenirken hata oluştu');
        } finally {
            setUploadingImages(false);
            e.target.value = '';
        }
    };

    const handleImageDelete = async (imageId) => {
        if (!editingProduct || !confirm('Bu görseli silmek istediğinize emin misiniz?')) return;

        try {
            await deleteProductImage(editingProduct._id, imageId);
            toast.success('Görsel silindi!');

            // Ürünü yeniden yükle
            const response = await getProducts();
            setProducts(response.data.data);
            const updated = response.data.data.find(p => p._id === editingProduct._id);
            if (updated) setEditingProduct(updated);
        } catch (error) {
            toast.error('Görsel silinirken hata oluştu');
        }
    };

    if (loading) {
        return <Loading text="Ürünler yükleniyor..." />;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Ürünler</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Yeni Ürün</span>
                </button>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="card p-8 text-center text-dark-500">
                    Henüz ürün bulunmuyor
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product._id} className="card overflow-hidden">
                            <div className="aspect-video bg-light-200 dark:bg-dark-700">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-dark-500">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate text-light-900 dark:text-white">{product.name}</h3>
                                        <p className="text-light-500 dark:text-dark-400 text-sm truncate">{product.category?.name}</p>
                                    </div>
                                    <div className="flex items-center space-x-1 ml-2">
                                        <button
                                            onClick={() => openModal(product)}
                                            className="p-2 bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product)}
                                            className="p-2 bg-light-200 dark:bg-dark-600 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-light-500 dark:text-dark-500 text-xs mt-2">
                                    {product.images?.length || 0} görsel
                                    {product.price != null && (
                                        <span className="ml-2 text-primary-500 font-medium">
                                            {product.price.toLocaleString('tr-TR')} ₺
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl w-full max-w-2xl my-8 animate-fade-in shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-700">
                            <h2 className="font-semibold text-light-900 dark:text-white">
                                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
                            </h2>
                            <button onClick={closeModal} className="text-light-500 dark:text-dark-400 hover:text-light-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Ürün Adı *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Örn: 3D Anahtarlık"
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Kategori *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input"
                                        required
                                    >
                                        <option value="">Kategori seçin</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Açıklama *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Ürün açıklaması"
                                    rows={3}
                                    className="input resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Standart Boyut</label>
                                    <input
                                        type="text"
                                        value={formData.standardSize}
                                        onChange={(e) => setFormData({ ...formData, standardSize: e.target.value })}
                                        placeholder="Örn: 5x3x1 cm"
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="Örn: 150"
                                        min="0"
                                        step="0.01"
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Sıralama</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            {/* Image Upload - Only for existing products */}
                            {editingProduct && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Görseller</label>

                                    {/* Current Images */}
                                    {editingProduct.images?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {editingProduct.images.map((img) => (
                                                <div key={img._id} className="relative group">
                                                    <img
                                                        src={img.url}
                                                        alt=""
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageDelete(img._id)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <label className="flex items-center justify-center p-4 border-2 border-dashed border-light-300 dark:border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploadingImages}
                                        />
                                        {uploadingImages ? (
                                            <span className="text-light-500 dark:text-dark-400">Yükleniyor...</span>
                                        ) : (
                                            <div className="text-center">
                                                <Upload className="w-6 h-6 text-light-500 dark:text-dark-400 mx-auto mb-1" />
                                                <span className="text-light-500 dark:text-dark-400 text-sm">Görsel Yükle</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary w-full flex items-center justify-center space-x-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                            </button>

                            {!editingProduct && (
                                <p className="text-light-500 dark:text-dark-500 text-xs text-center">
                                    Görseller ürün oluşturulduktan sonra eklenebilir.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
