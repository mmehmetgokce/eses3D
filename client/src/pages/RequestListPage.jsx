import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { useRequest } from '../context/RequestContext';
import { createRequest } from '../services/api';
import toast from 'react-hot-toast';

const RequestListPage = () => {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, updateNote, clearList } = useRequest();
    const [customerName, setCustomerName] = useState('');
    const [customerSurname, setCustomerSurname] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [generalNote, setGeneralNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Telefon numarası formatı: 5XX XXX XX XX
    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        const limited = numbers.slice(0, 10);
        if (limited.length <= 3) return limited;
        if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
        if (limited.length <= 8) return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setCustomerPhone(formatted);
    };

    // API için telefon numarasını düzelt (905XXXXXXXXX formatı)
    const getCleanPhone = () => {
        const numbers = customerPhone.replace(/\D/g, '');
        if (numbers.length === 10 && numbers.startsWith('5')) {
            return `90${numbers}`;
        }
        return '';
    };

    // Form doğrulama
    const validateForm = () => {
        if (items.length === 0) {
            toast.error('Talep listeniz boş!');
            return false;
        }

        if (!customerName.trim()) {
            toast.error('Ad alanı zorunludur!');
            return false;
        }

        if (!customerSurname.trim()) {
            toast.error('Soyad alanı zorunludur!');
            return false;
        }

        const phoneDigits = customerPhone.replace(/\D/g, '');
        if (phoneDigits.length !== 10) {
            toast.error('Telefon numarası 10 haneli olmalıdır (5XX XXX XX XX)');
            return false;
        }

        if (!phoneDigits.startsWith('5')) {
            toast.error('Telefon numarası 5 ile başlamalıdır');
            return false;
        }

        return true;
    };

    // Onay dialogunu göster
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowConfirm(true);
        }
    };

    // Talebi gerçekten gönder
    const handleConfirmedSubmit = async () => {
        try {
            setLoading(true);
            setShowConfirm(false);

            const requestData = {
                customerName: customerName.trim(),
                customerSurname: customerSurname.trim(),
                customerPhone: getCleanPhone(),
                generalNote,
                items: items.map(item => ({
                    product: item.product._id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    unitPrice: item.product.price || null,
                    note: item.note
                }))
            };

            const response = await createRequest(requestData);

            if (response.data.success) {
                // Ürün bilgilerini success sayfasına aktar
                const orderItems = items.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price || null
                }));
                clearList();
                navigate(`/talep-basarili/${response.data.data.requestId}`, {
                    state: { orderItems }
                });
            }
        } catch (error) {
            console.error('Talep gönderme hatası:', error);
            toast.error('Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen py-20 animate-fade-in">
                <div className="container mx-auto px-4 text-center">
                    <ShoppingBag className="w-20 h-20 text-light-400 dark:text-dark-600 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-4">Talep Listeniz Boş</h1>
                    <p className="text-light-600 dark:text-dark-400 mb-8">
                        Henüz listeye eklediğiniz bir ürün yok. Ürünleri inceleyerek başlayın!
                    </p>
                    <Link to="/urunler" className="btn-primary inline-flex items-center space-x-2">
                        <span>Ürünleri İncele</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Talep Listem</h1>
                    <p className="text-light-600 dark:text-dark-400">
                        Listedeki ürünleri kontrol edin ve talebi gönderin.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.product._id} className="card p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Image */}
                                    <div className="w-full sm:w-24 h-32 sm:h-24 flex-shrink-0">
                                        <img
                                            src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <Link
                                                to={`/urunler/${item.product._id}`}
                                                className="font-semibold hover:text-primary-400 transition-colors"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <button
                                                onClick={() => removeItem(item.product._id)}
                                                className="text-light-500 dark:text-dark-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {item.product.standardSize && (
                                            <p className="text-light-500 dark:text-dark-500 text-sm mb-3">
                                                Standart Boyut: {item.product.standardSize}
                                            </p>
                                        )}

                                        {/* Fiyat ve Quantity yan yana */}
                                        <div className="flex items-center justify-between mb-3">
                                            {/* Quantity */}
                                            <div className="flex items-center space-x-3">
                                                <span className="text-light-500 dark:text-dark-400 text-sm">Adet:</span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-1 bg-light-200 dark:bg-dark-700 rounded hover:bg-light-300 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                        className="p-1 bg-light-200 dark:bg-dark-700 rounded hover:bg-light-300 dark:hover:bg-dark-600"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Birim Fiyat */}
                                            {item.product.price != null && (
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-primary-500 dark:text-primary-400">
                                                        {(item.product.price * item.quantity).toLocaleString('tr-TR')} ₺
                                                    </span>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-light-500 dark:text-dark-500">
                                                            Birim: {item.product.price.toLocaleString('tr-TR')} ₺
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Note */}
                                        <input
                                            type="text"
                                            placeholder="Ürüne özel not ekleyin (opsiyonel)"
                                            value={item.note}
                                            onChange={(e) => updateNote(item.product._id, e.target.value)}
                                            className="input text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear List */}
                        <button
                            onClick={() => {
                                if (confirm('Tüm listeyi temizlemek istediğinize emin misiniz?')) {
                                    clearList();
                                }
                            }}
                            className="text-light-500 dark:text-dark-500 hover:text-red-500 text-sm transition-colors"
                        >
                            Listeyi Temizle
                        </button>
                    </div>

                    {/* Sidebar - Request Form */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Talep Özeti</h2>

                            <div className="mb-6">
                                <p className="text-light-500 dark:text-dark-400 text-sm mb-2">Toplam Ürün</p>
                                <p className="text-2xl font-bold">{items.length} Ürün</p>
                                <p className="text-light-500 dark:text-dark-500 text-sm">
                                    ({items.reduce((sum, item) => sum + item.quantity, 0)} adet)
                                </p>
                                {items.some(item => item.product.price != null) && (
                                    <div className="mt-3 pt-3 border-t border-light-200 dark:border-dark-700">
                                        <p className="text-light-500 dark:text-dark-400 text-sm">Tahmini Toplam</p>
                                        <p className="text-xl font-bold text-primary-500 dark:text-primary-400">
                                            {items.reduce((sum, item) => {
                                                if (item.product.price != null) {
                                                    return sum + (item.product.price * item.quantity);
                                                }
                                                return sum;
                                            }, 0).toLocaleString('tr-TR')} ₺
                                        </p>
                                        <p className="text-light-500 dark:text-dark-500 text-xs mt-1">
                                            * Fiyatlar değişiklik gösterebilir
                                        </p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                {/* Ad Soyad - Yan yana */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Ad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Adınız"
                                            required
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Soyad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerSurname}
                                            onChange={(e) => setCustomerSurname(e.target.value)}
                                            placeholder="Soyadınız"
                                            required
                                            className="input"
                                        />
                                    </div>
                                </div>

                                {/* Telefon */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Telefon Numarası <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 bg-light-200 dark:bg-dark-700 border border-r-0 border-light-300 dark:border-dark-600 rounded-l-lg text-light-600 dark:text-dark-400 text-sm">
                                            +90
                                        </span>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={handlePhoneChange}
                                            placeholder="5XX XXX XX XX"
                                            required
                                            className="input rounded-l-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Genel Not (Opsiyonel)
                                    </label>
                                    <textarea
                                        value={generalNote}
                                        onChange={(e) => setGeneralNote(e.target.value)}
                                        placeholder="Eklemek istediğiniz notlar..."
                                        rows={3}
                                        className="input resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span>Gönderiliyor...</span>
                                    ) : (
                                        <>
                                            <span>Talebi Gönder</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 p-4 bg-light-200/50 dark:bg-dark-700/50 rounded-lg">
                                <p className="text-light-600 dark:text-dark-400 text-xs leading-relaxed">
                                    <strong className="text-light-700 dark:text-dark-300">Not:</strong> Talep gönderdikten sonra
                                    benzersiz bir talep numarası alacaksınız. Talebiniz incelendikten sonra sizinle
                                    iletişime geçilecektir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Onay Dialogu */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl w-full max-w-md animate-fade-in">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-700">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                <h3 className="font-semibold">Talebi Onaylayın</h3>
                            </div>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="text-light-500 dark:text-dark-400 hover:text-light-900 dark:hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <p className="text-light-600 dark:text-dark-400 text-sm mb-4">
                                Aşağıdaki ürünleri talep etmek üzeresiniz:
                            </p>

                            {/* Ürün Listesi */}
                            <div className="bg-light-100 dark:bg-dark-700/50 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
                                {items.map((item, index) => (
                                    <div
                                        key={item.product._id}
                                        className={`flex items-center justify-between py-2 ${index !== items.length - 1 ? 'border-b border-light-200 dark:border-dark-600' : ''}`}
                                    >
                                        <span className="text-sm font-medium">{item.product.name}</span>
                                        <div className="text-right">
                                            <span className="text-sm text-light-500 dark:text-dark-400">
                                                {item.quantity} adet
                                            </span>
                                            {item.product.price != null && (
                                                <p className="text-xs font-medium text-primary-500">
                                                    {(item.product.price * item.quantity).toLocaleString('tr-TR')} ₺
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-sm font-semibold mb-2 px-1">
                                <span>Toplam</span>
                                <span>{items.reduce((sum, item) => sum + item.quantity, 0)} adet</span>
                            </div>
                            {items.some(item => item.product.price != null) && (
                                <div className="flex items-center justify-between text-sm font-semibold mb-4 px-1 text-primary-500">
                                    <span>Tahmini Tutar</span>
                                    <span>
                                        {items.reduce((sum, item) => {
                                            if (item.product.price != null) {
                                                return sum + (item.product.price * item.quantity);
                                            }
                                            return sum;
                                        }, 0).toLocaleString('tr-TR')} ₺
                                    </span>
                                </div>
                            )}

                            <p className="text-light-500 dark:text-dark-500 text-xs mb-4">
                                Onayladıktan sonra talebiniz bize iletilecek ve sizinle iletişime geçilecektir.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 p-4 border-t border-light-300 dark:border-dark-700">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 btn-secondary"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleConfirmedSubmit}
                                disabled={loading}
                                className="flex-1 btn-primary"
                            >
                                {loading ? 'Gönderiliyor...' : 'Onayla ve Gönder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestListPage;
