import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import Loading from '../components/Loading';
import ColorCircle from '../components/ColorCircle';
import { getProductById } from '../services/api';
import { useRequest } from '../context/RequestContext';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = '905522234619';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
    const { addItem, isInList } = useRequest();

    // Seçili renk kombinasyonu ile listede mi kontrol et
    const getSelectedColors = () => {
        if (!product) return [];
        const hasColors = product.colorCombinations?.length > 0;
        return hasColors && selectedColorIndex >= 0
            ? product.colorCombinations[selectedColorIndex].colors
            : [];
    };

    const currentColors = getSelectedColors();
    const inList = product ? isInList(product._id, currentColors) : false;

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await getProductById(id);
            setProduct(response.data.data);
        } catch (error) {
            console.error('Ürün yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToList = () => {
        if (product) {
            const hasColors = product.colorCombinations?.length > 0;

            if (hasColors && selectedColorIndex < 0) {
                toast.error('Lütfen bir renk seçimi yapın!');
                return;
            }

            if (inList) {
                toast('Bu renk zaten listenizde!', { icon: '⚠️' });
                return;
            }

            addItem(product, 1, '', currentColors);
            const colorText = currentColors.length > 0 ? ` (${currentColors.join('-')})` : '';
            toast.success(`"${product.name}"${colorText} talep listesine eklendi!`);

            // Renk seçimini sıfırla, başka renk ekleyebilsin
            setSelectedColorIndex(-1);
        }
    };

    const nextImage = () => {
        if (product?.images?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product?.images?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
        return <Loading text="Ürün yükleniyor..." />;
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-light-500 dark:text-dark-400 text-lg mb-4">Ürün bulunamadı.</p>
                <Link to="/urunler" className="btn-primary">
                    Ürünlere Dön
                </Link>
            </div>
        );
    }

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}`;

    return (
        <div className="min-h-screen py-8 animate-fade-in">
            <SEO
                title={product.name}
                description={product.description || `${product.name} - eses3D 3D baskı ürünü. Detayları inceleyin ve talep listesine ekleyin.`}
                path={`/urunler/${product._id}`}
            />
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <Link
                    to="/urunler"
                    className="inline-flex items-center space-x-2 text-light-500 dark:text-dark-400 hover:text-light-900 dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Ürünlere Dön</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <div className="relative aspect-square bg-light-200 dark:bg-dark-800 rounded-xl overflow-hidden mb-4">
                            {product.images?.length > 0 ? (
                                <>
                                    <img
                                        src={product.images[currentImageIndex]?.url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Navigation Arrows */}
                                    {product.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark-900/80 hover:bg-dark-800 p-2 rounded-full transition-all"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark-900/80 hover:bg-dark-800 p-2 rounded-full transition-all"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-dark-500">
                                    Görsel yok
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images?.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                            ? 'border-primary-500'
                                            : 'border-transparent hover:border-dark-600'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} - ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Category Badge */}
                        {product.category && (
                            <span className="inline-block bg-light-200 dark:bg-dark-700 text-light-700 dark:text-dark-300 text-sm px-3 py-1 rounded-full mb-4">
                                {product.category.name}
                            </span>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-light-900 dark:text-white">{product.name}</h1>

                        {/* Fiyat */}
                        <div className="mb-4">
                            {product.price != null ? (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl md:text-3xl font-bold text-primary-500 dark:text-primary-400">
                                        {product.price.toLocaleString('tr-TR')} ₺
                                    </span>
                                    <span className="text-xs text-light-500 dark:text-dark-500">KDV dahil</span>
                                </div>
                            ) : (
                                <span className="text-lg text-light-500 dark:text-dark-400 italic">
                                    Fiyat bilgisi için iletişime geçin
                                </span>
                            )}
                        </div>

                        {product.standardSize && (
                            <p className="text-light-500 dark:text-dark-400 mb-4">
                                <span className="font-medium text-light-700 dark:text-dark-300">Standart Boyut:</span> {product.standardSize}
                            </p>
                        )}

                        <p className="text-light-600 dark:text-dark-300 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        {/* Renk Seçimi */}
                        {product.colorCombinations?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-light-700 dark:text-dark-300 mb-3">
                                    Renk Seçimi <span className="text-red-500">*</span>
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {product.colorCombinations.map((combo, index) => (
                                        <ColorCircle
                                            key={index}
                                            colors={combo.colors}
                                            size={36}
                                            selected={selectedColorIndex === index}
                                            onClick={() => setSelectedColorIndex(index)}
                                            showLabel
                                        />
                                    ))}
                                </div>
                                {selectedColorIndex >= 0 && (
                                    <p className="text-sm text-primary-500 mt-2 font-medium">
                                        Seçilen: {product.colorCombinations[selectedColorIndex].colors.join(' - ')}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={handleAddToList}
                                disabled={inList}
                                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-lg font-semibold transition-all ${inList
                                    ? 'bg-green-500/20 text-green-400 cursor-default'
                                    : 'btn-primary'
                                    }`}
                            >
                                {inList ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Listede</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        <span>Listeye Ekle</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 btn-whatsapp flex items-center justify-center space-x-2 py-4"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>WhatsApp ile Sor</span>
                            </a>
                        </div>

                        {/* Info Box */}
                        <div className="bg-yellow-50 dark:bg-dark-800/50 border border-yellow-200 dark:border-dark-700 rounded-xl p-6">
                            <h3 className="font-semibold mb-3 text-light-900 dark:text-white">Önemli Bilgiler</h3>
                            <ul className="text-light-700 dark:text-dark-400 text-sm space-y-2">
                                <li>• Fiyat; ölçü, malzeme ve talebe göre değişir.</li>
                                <li>• Özel boyut istiyorsanız WhatsApp üzerinden iletişime geçin.</li>
                                <li>• Her talep benzersiz bir numara ile kayıt altına alınır.</li>
                            </ul>
                        </div>

                        {/* Request List Link */}
                        {inList && (
                            <Link
                                to="/talep-listem"
                                className="block mt-6 text-center text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                Talep listesine git →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
