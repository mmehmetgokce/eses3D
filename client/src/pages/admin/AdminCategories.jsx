import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', order: 0 });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                order: category.order || 0
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', order: 0 });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', order: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Kategori adı gereklidir!');
            return;
        }

        try {
            setSaving(true);
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
                toast.success('Kategori güncellendi!');
            } else {
                await createCategory(formData);
                toast.success('Kategori eklendi!');
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            const message = error.response?.data?.message || 'İşlem sırasında hata oluştu';
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            await deleteCategory(category._id);
            toast.success('Kategori silindi!');
            fetchCategories();
        } catch (error) {
            toast.error('Kategori silinirken hata oluştu');
        }
    };

    if (loading) {
        return <Loading text="Kategoriler yükleniyor..." />;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Kategoriler</h1>
                <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Yeni Kategori</span>
                </button>
            </div>

            {/* Categories List */}
            <div className="card">
                {categories.length === 0 ? (
                    <div className="p-8 text-center text-light-500 dark:text-dark-500">
                        Henüz kategori bulunmuyor
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-light-300 dark:border-dark-700">
                                <th className="text-left p-4 text-light-500 dark:text-dark-400 font-medium">Sıra</th>
                                <th className="text-left p-4 text-light-500 dark:text-dark-400 font-medium">Ad</th>
                                <th className="text-left p-4 text-light-500 dark:text-dark-400 font-medium">Slug</th>
                                <th className="text-left p-4 text-light-500 dark:text-dark-400 font-medium">Açıklama</th>
                                <th className="text-right p-4 text-light-500 dark:text-dark-400 font-medium">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-300 dark:divide-dark-700">
                            {categories.map((category) => (
                                <tr key={category._id} className="hover:bg-light-100 dark:hover:bg-dark-700/50">
                                    <td className="p-4 text-sm text-light-700 dark:text-white">{category.order}</td>
                                    <td className="p-4 font-medium text-light-900 dark:text-white">{category.name}</td>
                                    <td className="p-4 text-light-500 dark:text-dark-400 text-sm">{category.slug}</td>
                                    <td className="p-4 text-light-500 dark:text-dark-400 text-sm">{category.description || '-'}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => openModal(category)}
                                                className="p-2 bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                className="p-2 bg-light-200 dark:bg-dark-600 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl w-full max-w-md animate-fade-in shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-700">
                            <h2 className="font-semibold text-light-900 dark:text-white">
                                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                            </h2>
                            <button onClick={closeModal} className="text-light-500 dark:text-dark-400 hover:text-light-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Kategori Adı *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: Anahtarlıklar"
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Açıklama</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Kategori açıklaması (opsiyonel)"
                                    rows={3}
                                    className="input resize-none"
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

                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary w-full flex items-center justify-center space-x-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
