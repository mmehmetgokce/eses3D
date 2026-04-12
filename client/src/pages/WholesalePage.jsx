import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Minus, Plus, Trash2, ShoppingBag, Gift, TrendingUp, X } from 'lucide-react';
import { useWholesale, TIERS } from '../context/WholesaleContext';
import { getProducts, getCategories } from '../services/api';
import { createRequest } from '../services/api';
import { getColorHex } from '../components/ColorCircle';
import ColorCircle from '../components/ColorCircle';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const WholesalePage = () => {
    const navigate = useNavigate();
    const {
        items, addItem, removeItem, updateQuantity, clearList,
        totalItems, currentTier, nextTier, discountPercent,
        currentStand, calculateTotal
    } = useWholesale();

    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // stand fotoğrafları için
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerSurname, setCustomerSurname] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [generalNote, setGeneralNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Renk Seçim Modalı
    const [colorModal, setColorModal] = useState(null); // { product, selectedColors, qty }
    const [modalColors, setModalColors] = useState([]);
    const [modalQty, setModalQty] = useState(10);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, allProductsRes, categoriesRes] = await Promise.all([
                getProducts({ wholesale: true }),
                getProducts(), // tüm ürünler (stand fotoğrafları için)
                getCategories()
            ]);
            setProducts(productsRes.data.data);
            setAllProducts(allProductsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            console.error('Veri yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    // Ürünlerin ait olduğu kategorileri bul
    const availableCategories = categories.filter(cat =>
        products.some(p => p.categories?.some(c => (c._id || c) === cat._id))
    );

    // Filtrelenmiş ürünler
    const filteredProducts = selectedCategory
        ? products.filter(p => p.categories?.some(c => (c._id || c) === selectedCategory))
        : products;

    // Stand fotoğrafları (tam ürün adıyla eşleşir)
    const singleStandProduct = allProducts.find(p => p.name === 'Tek Katlı Anahtarlık Standı');
    const doubleStandProduct = allProducts.find(p => p.name === 'Çift Katlı Anahtarlık Standı');
    const singleStandImage = singleStandProduct?.images?.[0]?.url;
    const doubleStandImage = doubleStandProduct?.images?.[0]?.url;

    // Renk modalını aç
    const openColorModal = (product) => {
        const slots = product.colorSlots || [];
        const initialColors = slots.map(slot => ({
            label: slot.label || '',
            color: '',
            allowedColors: slot.allowedColors || []
        }));
        setColorModal(product);
        setModalColors(initialColors);
        setModalQty(10);
    };

    const closeColorModal = () => {
        setColorModal(null);
        setModalColors([]);
        setModalQty(10);
    };

    const handleModalColorSelect = (slotIndex, color) => {
        setModalColors(prev => prev.map((s, i) =>
            i === slotIndex ? { ...s, color } : s
        ));
    };

    const handleModalAdd = () => {
        if (!colorModal) return;
        const hasSlots = colorModal.colorSlots?.length > 0;

        if (hasSlots) {
            const allSelected = modalColors.every(s => s.color !== '');
            if (!allSelected) {
                toast.error('Tüm renk seçeneklerini belirleyin!');
                return;
            }
        }

        if (modalQty < 1) {
            toast.error('En az 1 adet girin!');
            return;
        }

        const selectedColors = hasSlots
            ? modalColors.map(s => ({ label: s.label, color: s.color }))
            : [];

        addItem(colorModal, modalQty, selectedColors);
        toast.success(`${modalQty} adet ${colorModal.name} sepete eklendi!`);
        closeColorModal();
    };

    // Telefon formatı
    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        const limited = numbers.slice(0, 10);
        if (limited.length <= 3) return limited;
        if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
        if (limited.length <= 8) return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
    };

    // Toptan talep gönder
    const handleSubmit = async () => {
        if (totalItems < 50) {
            toast.error('Minimum 50 adet sipariş gereklidir!');
            return;
        }
        if (!customerName.trim() || !customerSurname.trim()) {
            toast.error('Ad ve soyad gereklidir!');
            return;
        }
        const cleanPhone = customerPhone.replace(/\D/g, '');
        if (cleanPhone.length !== 10 || !cleanPhone.startsWith('5')) {
            toast.error('Geçerli bir telefon numarası girin!');
            return;
        }

        try {
            setSubmitting(true);

            const requestItems = items.map(item => ({
                product: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: Math.round(item.price * (1 - discountPercent / 100) * 100) / 100,
                selectedColors: item.selectedColors || [],
                note: ''
            }));

            const standLabel = currentStand ? currentStand.label : '';

            const response = await createRequest({
                customerName: customerName.trim(),
                customerSurname: customerSurname.trim(),
                customerPhone: `90${cleanPhone}`,
                items: requestItems,
                generalNote: `[TOPTAN SİPARİŞ] İndirim: %${discountPercent} | Toplam Adet: ${totalItems} | ${standLabel} Hediye${generalNote ? '\n\nNot: ' + generalNote : ''}`,
                isWholesale: true,
                discountPercent
            });

            if (response.data.success) {
                clearList();
                toast.success('Toptan talebiniz başarıyla gönderildi!');
                navigate(`/talep-basarili/${response.data.data.requestId}`);
            }
        } catch (error) {
            toast.error('Talep gönderilirken hata oluştu');
        } finally {
            setSubmitting(false);
        }
    };

    const { subtotal, discount, total } = calculateTotal();

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-8 animate-fade-in">
            <SEO
                title="Toptan Satış | eses3D"
                description="eses3D toptan satış fırsatlarını keşfedin. Minimum 50 adet sipariş, kademeli indirimler ve hediye stand."
                noindex={true}
            />

            <div className="container mx-auto px-4">
                {/* Hero */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Package className="w-4 h-4" />
                        Toptan Satış
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-light-900 dark:text-white mb-3">
                        Toptan Sipariş
                    </h1>
                    <p className="text-light-600 dark:text-dark-400 max-w-2xl mx-auto">
                        Minimum 50 adet sipariş verin, kademeli indirimlerden yararlanın.
                        Her siparişe hediye anahtarlık standı dahildir!
                    </p>
                </div>

                {/* Kademe Tablosu */}
                <div className="bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl p-5 mb-8">
                    <h3 className="font-semibold text-light-900 dark:text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Kademe İndirimleri
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {TIERS.map((tier, i) => (
                            <div
                                key={i}
                                className={`text-center p-3 rounded-lg border-2 transition-all ${
                                    currentTier?.min === tier.min
                                        ? 'border-primary-500 bg-primary-500/10'
                                        : totalItems > 0 && totalItems < tier.min
                                            ? 'border-light-200 dark:border-dark-600 opacity-60'
                                            : 'border-light-200 dark:border-dark-600'
                                }`}
                            >
                                <div className="text-lg font-bold text-primary-500">{tier.min}+</div>
                                <div className="text-sm font-semibold text-light-900 dark:text-white">%{tier.discount}</div>
                                <div className="text-xs text-light-500 dark:text-dark-400">indirim</div>
                            </div>
                        ))}
                    </div>
                    {/* Stand bilgisi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                            {singleStandImage ? (
                                <img src={singleStandImage} alt="Tek Katlı Stand" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                                <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🏗️</div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-green-700 dark:text-green-400">50 - 70 Adet</p>
                                <p className="text-xs text-green-600 dark:text-green-500">Tek Katlı Stand Hediye!</p>
                                <p className="text-xs mt-0.5"><span className="text-red-400 line-through">200 ₺</span> <span className="text-green-600 dark:text-green-400 font-bold">Ücretsiz</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                            {doubleStandImage ? (
                                <img src={doubleStandImage} alt="Çift Katlı Stand" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                                <div className="w-14 h-14 bg-amber-500/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🏗️🏗️</div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">80 - 100+ Adet</p>
                                <p className="text-xs text-amber-600 dark:text-amber-500">Çift Katlı Stand Hediye!</p>
                                <p className="text-xs mt-0.5"><span className="text-red-400 line-through">400 ₺</span> <span className="text-amber-600 dark:text-amber-400 font-bold">Ücretsiz</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol: Ürün Listesi */}
                    <div className="lg:col-span-2">
                        {/* Kategori Filtresi */}
                        {availableCategories.length > 1 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        !selectedCategory
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-light-100 dark:bg-dark-700 text-light-700 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-600'
                                    }`}
                                >
                                    Tümü
                                </button>
                                {availableCategories.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat._id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            selectedCategory === cat._id
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-light-100 dark:bg-dark-700 text-light-700 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-600'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Ürün Kartları */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12 text-light-500 dark:text-dark-400">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Toptan satışa uygun ürün bulunamadı.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredProducts.map(product => {
                                    const unitPrice = product.price || 0;
                                    const discountedPrice = Math.round(unitPrice * (1 - discountPercent / 100) * 100) / 100;
                                    // Bu üründen sepetteki toplam adet
                                    const productTotalQty = items
                                        .filter(i => i.productId === product._id)
                                        .reduce((sum, i) => sum + i.quantity, 0);

                                    return (
                                        <div
                                            key={product._id}
                                            className={`bg-white dark:bg-dark-800 border rounded-xl overflow-hidden transition-all ${
                                                productTotalQty > 0
                                                    ? 'border-primary-500 shadow-md shadow-primary-500/10'
                                                    : 'border-light-200 dark:border-dark-700 hover:border-light-300 dark:hover:border-dark-600'
                                            }`}
                                        >
                                            <div className="flex">
                                                {/* Görsel */}
                                                <div className="w-28 h-28 flex-shrink-0">
                                                    <img
                                                        src={product.images?.[0]?.url || '/placeholder.jpg'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {/* Bilgi */}
                                                <div className="flex-1 p-3 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-light-900 dark:text-white line-clamp-1">
                                                            {product.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {discountPercent > 0 ? (
                                                                <>
                                                                    <span className="text-xs text-light-400 dark:text-dark-500 line-through">
                                                                        {unitPrice.toLocaleString('tr-TR')} ₺
                                                                    </span>
                                                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                                                        {discountedPrice.toLocaleString('tr-TR')} ₺
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-sm font-semibold text-primary-500">
                                                                    {unitPrice > 0 ? `${unitPrice.toLocaleString('tr-TR')} ₺` : 'Fiyat Sorunuz'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {productTotalQty > 0 && (
                                                            <p className="text-xs text-primary-500 mt-1">Sepette: {productTotalQty} adet</p>
                                                        )}
                                                    </div>
                                                    {/* Ekle Butonu */}
                                                    <div className="mt-2">
                                                        <button
                                                            onClick={() => openColorModal(product)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                                        >
                                                            {product.colorSlots?.length > 0 ? 'Renk Seç & Ekle' : 'Sepete Ekle'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sağ: Sipariş Özeti */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl p-5">
                                <h3 className="font-semibold text-light-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Sipariş Özeti
                                </h3>

                                {items.length === 0 ? (
                                    <p className="text-light-500 dark:text-dark-400 text-sm text-center py-4">
                                        Henüz ürün eklenmedi
                                    </p>
                                ) : (
                                    <>
                                        {/* Seçilen Ürünler */}
                                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                                            {items.map(item => (
                                                <div key={item._itemKey} className="flex items-center justify-between text-sm py-2 border-b border-light-100 dark:border-dark-700 last:border-0">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-light-900 dark:text-white truncate">{item.productName}</p>
                                                        {item.selectedColors?.length > 0 && (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                {item.selectedColors.map((c, idx) => (
                                                                    <ColorCircle key={idx} colors={[c.color]} size={14} />
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <button
                                                                onClick={() => updateQuantity(item._itemKey, item.quantity - 1)}
                                                                className="w-5 h-5 rounded bg-light-200 dark:bg-dark-600 flex items-center justify-center hover:bg-light-300 dark:hover:bg-dark-500 transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item._itemKey, item.quantity + 1)}
                                                                className="w-5 h-5 rounded bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-2 flex items-center gap-1.5">
                                                        <p className="font-semibold text-light-900 dark:text-white text-xs">
                                                            {(item.price * item.quantity * (1 - discountPercent / 100)).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                                                        </p>
                                                        <button
                                                            onClick={() => removeItem(item._itemKey)}
                                                            className="text-red-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Toplam Adet & Kademe */}
                                        <div className="bg-light-50 dark:bg-dark-700/50 rounded-lg p-3 mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-light-600 dark:text-dark-400">Toplam Adet</span>
                                                <span className={`font-bold ${totalItems >= 50 ? 'text-green-600 dark:text-green-400' : 'text-amber-500'}`}>
                                                    {totalItems}
                                                </span>
                                            </div>
                                            {currentTier && (
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-light-600 dark:text-dark-400">Kademe İndirimi</span>
                                                    <span className="font-bold text-green-600 dark:text-green-400">%{discountPercent}</span>
                                                </div>
                                            )}
                                            {nextTier && totalItems < 100 && (
                                                <p className="text-xs text-primary-500 mt-2">
                                                    💡 {nextTier.min - totalItems} adet daha ekleyerek %{nextTier.discount} indirime ulaşın!
                                                </p>
                                            )}
                                            {totalItems < 50 && totalItems > 0 && (
                                                <p className="text-xs text-amber-500 mt-2">
                                                    ⚠️ Minimum sipariş: 50 adet ({50 - totalItems} adet daha gerekli)
                                                </p>
                                            )}
                                        </div>

                                        {/* Fiyat Özeti */}
                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-light-600 dark:text-dark-400">Ara Toplam</span>
                                                <span className="text-light-900 dark:text-white">{subtotal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                                    <span>İndirim (%{discountPercent})</span>
                                                    <span>-{discount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-light-200 dark:border-dark-600">
                                                <span className="text-light-900 dark:text-white">Toplam</span>
                                                <span className="text-primary-500">{total.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</span>
                                            </div>
                                        </div>

                                        {/* Hediye Stand */}
                                        {currentStand && (
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    {(() => {
                                                        const standImg = totalItems >= 80 ? doubleStandImage : singleStandImage;
                                                        return standImg ? (
                                                            <img src={standImg} alt={currentStand.label} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                                        ) : (
                                                            <Gift className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                        );
                                                    })()}
                                                    <div>
                                                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                                                            🎁 {currentStand.label}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-sm text-red-400 line-through font-semibold">{currentStand.price} ₺</span>
                                                            <span className="text-sm text-green-600 dark:text-green-400 font-bold">Ücretsiz!</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Sepeti Temizle */}
                                        <button
                                            onClick={clearList}
                                            className="w-full text-sm text-red-400 hover:text-red-500 py-2 transition-colors"
                                        >
                                            Sepeti Temizle
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Sipariş Formu */}
                            {totalItems >= 50 && (
                                <div className="bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl p-5 animate-fade-in">
                                    <h3 className="font-semibold text-light-900 dark:text-white mb-4">İletişim Bilgileri</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Ad *"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="input text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Soyad *"
                                            value={customerSurname}
                                            onChange={(e) => setCustomerSurname(e.target.value)}
                                            className="input text-sm"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="5XX XXX XX XX *"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
                                            className="input text-sm"
                                        />
                                        <textarea
                                            placeholder="Not (opsiyonel)"
                                            value={generalNote}
                                            onChange={(e) => setGeneralNote(e.target.value)}
                                            className="input text-sm"
                                            rows={2}
                                        />
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full btn btn-primary py-3 font-semibold"
                                        >
                                            {submitting ? 'Gönderiliyor...' : 'Toptan Talep Gönder'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Renk Seçim Modalı */}
            {colorModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeColorModal}>
                    <div
                        className="bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-light-200 dark:border-dark-700">
                            <div className="flex items-center gap-3">
                                <img
                                    src={colorModal.images?.[0]?.url || '/placeholder.jpg'}
                                    alt={colorModal.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-light-900 dark:text-white">{colorModal.name}</h3>
                                    <p className="text-xs text-light-500 dark:text-dark-400">
                                        {discountPercent > 0 && (
                                            <><span className="line-through">{colorModal.price?.toLocaleString('tr-TR')} ₺</span> → </>
                                        )}
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            {Math.round((colorModal.price || 0) * (1 - discountPercent / 100) * 100 / 100).toLocaleString('tr-TR')} ₺/adet
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={closeColorModal} className="p-2 hover:bg-light-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Renk Seçimi */}
                            {colorModal.colorSlots?.length > 0 && (
                                <div className="space-y-3">
                                    {modalColors.map((slot, slotIdx) => (
                                        <div key={slotIdx}>
                                            <label className="text-sm font-medium text-light-800 dark:text-dark-200 mb-2 block">
                                                {slot.label || `Renk ${slotIdx + 1}`}
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                {slot.allowedColors.map(color => {
                                                    const hex = getColorHex(color);
                                                    const isSelected = slot.color === color;
                                                    return (
                                                        <button
                                                            key={color}
                                                            type="button"
                                                            onClick={() => handleModalColorSelect(slotIdx, color)}
                                                            className={`w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${
                                                                isSelected
                                                                    ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-dark-800 scale-110'
                                                                    : 'border-light-300 dark:border-dark-500 hover:scale-110 hover:border-primary-400'
                                                            }`}
                                                            style={{ backgroundColor: hex }}
                                                            title={color}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            {slot.color && (
                                                <p className="text-xs text-primary-500 mt-1.5 font-medium">✓ Seçili: {slot.color}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Adet */}
                            <div>
                                <label className="text-sm font-medium text-light-800 dark:text-dark-200 mb-2 block">
                                    Adet
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setModalQty(Math.max(1, modalQty - 5))}
                                        className="w-9 h-9 rounded-lg bg-light-100 dark:bg-dark-700 flex items-center justify-center hover:bg-light-200 dark:hover:bg-dark-600 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={modalQty}
                                        onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 h-9 text-center font-semibold bg-light-100 dark:bg-dark-700 rounded-lg border-0 text-light-900 dark:text-white"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setModalQty(modalQty + 5)}
                                        className="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {[5, 10, 20, 50].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setModalQty(q)}
                                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                modalQty === q
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-light-100 dark:bg-dark-700 text-light-600 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-600'
                                            }`}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-light-200 dark:border-dark-700">
                            <button
                                onClick={handleModalAdd}
                                className="w-full btn btn-primary py-3 font-semibold"
                            >
                                {modalQty} Adet Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WholesalePage;
