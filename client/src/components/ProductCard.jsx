import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ColorCircle from './ColorCircle';

const ProductCard = ({ product }) => {
    const images = product.images?.length > 0 ? product.images : [{ url: '/placeholder.jpg' }];
    const hasMultipleImages = images.length > 1;

    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchDeltaX = useRef(0);
    const isTouching = useRef(false);

    // Tüm slotlardaki izin verilen renkleri tekrarsız topla
    const allColors = [];
    if (product.colorSlots?.length > 0) {
        product.colorSlots.forEach(slot => {
            slot.allowedColors?.forEach(color => {
                if (!allColors.includes(color)) {
                    allColors.push(color);
                }
            });
        });
    }

    // Kategoriler (çoklu veya tekli geriye uyum)
    const categoryNames = product.categories?.map(c => c.name) || (product.category ? [product.category.name] : []);

    // Desktop: Mouse yatay pozisyonuna göre görsel değiştir
    const handleMouseMove = useCallback((e) => {
        if (!hasMultipleImages) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const ratio = x / rect.width;
        const idx = Math.min(Math.floor(ratio * images.length), images.length - 1);
        setCurrentIndex(idx);
    }, [hasMultipleImages, images.length]);

    const handleMouseLeave = useCallback(() => {
        setCurrentIndex(0);
    }, []);

    // Mobil: Touch swipe
    const handleTouchStart = useCallback((e) => {
        if (!hasMultipleImages) return;
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
        isTouching.current = true;
    }, [hasMultipleImages]);

    const handleTouchMove = useCallback((e) => {
        if (!isTouching.current) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (!isTouching.current) return;
        isTouching.current = false;
        const threshold = 40;
        if (touchDeltaX.current < -threshold) {
            // Sola kaydır → sonraki
            setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
        } else if (touchDeltaX.current > threshold) {
            // Sağa kaydır → önceki
            setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
        // Link tıklamasını engelleme — sadece büyük kaydırmalarda
        if (Math.abs(touchDeltaX.current) > threshold) {
            e.preventDefault();
        }
    }, [images.length]);

    return (
        <Link
            to={`/urunler/${product._id}`}
            className="card card-hover group"
            draggable={false}
        >
            {/* Image Gallery */}
            <div
                className="relative aspect-square overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <img
                    src={images[currentIndex]?.url || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    draggable={false}
                />

                {/* Category Badges */}
                {categoryNames.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {categoryNames.slice(0, 2).map((name, i) => (
                            <span key={i} className="bg-dark-900/80 backdrop-blur-sm text-xs px-2.5 py-0.5 rounded-full text-dark-200">
                                {name}
                            </span>
                        ))}
                        {categoryNames.length > 2 && (
                            <span className="bg-dark-900/80 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full text-dark-200">
                                +{categoryNames.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Image Dots Indicator */}
                {hasMultipleImages && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                    i === currentIndex
                                        ? 'bg-white w-3'
                                        : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Mouse hover zone indicators (desktop only, subtle) */}
                {hasMultipleImages && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 hidden group-hover:flex">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 transition-colors duration-150 ${
                                    i === currentIndex ? 'bg-white/60' : 'bg-transparent'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-light-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-light-600 dark:text-dark-400 text-sm mt-1 line-clamp-2">
                    {product.description}
                </p>

                {product.standardSize && (
                    <p className="text-light-500 dark:text-dark-500 text-xs mt-2">
                        Standart Boyut: {product.standardSize}
                    </p>
                )}

                {/* İzin Verilen Renk Daireleri */}
                {allColors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {allColors.slice(0, 8).map((colorName) => (
                            <ColorCircle key={colorName} colors={[colorName]} size={20} />
                        ))}
                        {allColors.length > 8 && (
                            <span className="text-xs text-light-500 dark:text-dark-400 self-center">
                                +{allColors.length - 8}
                            </span>
                        )}
                    </div>
                )}

                {/* Fiyat */}
                <div className="mt-3 pt-3 border-t border-light-200 dark:border-dark-700">
                    {product.price != null ? (
                        <span className="text-lg font-bold text-primary-500 dark:text-primary-400">
                            {product.price.toLocaleString('tr-TR')} ₺
                        </span>
                    ) : (
                        <span className="text-sm text-light-500 dark:text-dark-400 italic">
                            Fiyat Sorunuz
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
